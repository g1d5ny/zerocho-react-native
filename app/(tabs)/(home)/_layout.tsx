import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import {
  type MaterialTopTabNavigationEventMap,
  type MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Slot, useRouter, withLayoutContext } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../_layout";
const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BlurView
        style={[
          styles.header,
          colorScheme === "dark" ? styles.headerDark : styles.headerLight,
        ]}
        intensity={colorScheme === "dark" ? 5 : 70}
      >
        {isLoggedIn && (
          <Pressable
            style={styles.menuButton}
            onPress={() => {
              setIsSideMenuOpen(true);
            }}
          >
            <Ionicons
              name="menu"
              size={24}
              color={colorScheme === "dark" ? "grey" : "black"}
            />
          </Pressable>
        )}
        <SideMenu
          isVisible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.headerLogo}
        />
        {!isLoggedIn && (
          <TouchableOpacity
            style={[
              styles.loginButton,
              colorScheme === "dark"
                ? styles.loginButtonDark
                : styles.loginButtonLight,
            ]}
            onPress={() => {
              router.navigate(`/login`);
            }}
          >
            <Text
              style={
                colorScheme === "dark"
                  ? styles.loginButtonTextDark
                  : styles.loginButtonTextLight
              }
            >
              로그인
            </Text>
          </TouchableOpacity>
        )}
      </BlurView>
      {isLoggedIn ? (
        <MaterialTopTabs
          screenOptions={{
            lazy: true, // 탭 이동시 렌더링 (렌더링 최적화)
            lazyPreloadDistance: 1,
            tabBarStyle: {
              backgroundColor: colorScheme === "dark" ? "#101010" : "white",
              shadowColor: "transparent",
              position: "relative",
            },
            tabBarPressColor: "transparent",
            tabBarActiveTintColor: colorScheme === "dark" ? "white" : "#555",
            tabBarIndicatorStyle: {
              backgroundColor: colorScheme === "dark" ? "white" : "black",
              height: 1,
            },
            tabBarIndicatorContainerStyle: {
              backgroundColor: colorScheme === "dark" ? "#aaa" : "#bbb",
              position: "absolute",
              top: 49,
              height: 1,
            },
          }}
        >
          <MaterialTopTabs.Screen name="index" options={{ title: "For you" }} />
          <MaterialTopTabs.Screen
            name="following"
            options={{ title: "Following" }}
          />
        </MaterialTopTabs>
      ) : (
        <Slot />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    backgroundColor: "#101010",
  },
  containerLight: {
    backgroundColor: "white",
  },
  headerLogo: {
    width: 48,
    height: 48,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  loginButton: {
    padding: 8,
    borderRadius: 10,
    position: "absolute",
    right: 16,
  },
  loginButtonDark: {
    backgroundColor: "white",
  },
  loginButtonLight: {
    backgroundColor: "black",
  },
  loginButtonTextLight: {
    color: "white",
  },
  loginButtonTextDark: {
    color: "black",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
  },
  headerDark: {
    backgroundColor: "#101010",
  },
  headerLight: {
    backgroundColor: "white",
  },
  menuButton: {
    padding: 8,
    position: "absolute",
    left: 16,
  },
});
