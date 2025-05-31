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
import { Slot, usePathname, useRouter, withLayoutContext } from "expo-router";
import { useContext, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const pathname = usePathname();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BlurView style={styles.header} intensity={70}>
        {isLoggedIn && (
          <Pressable
            style={styles.menuButton}
            onPress={() => {
              setIsSideMenuOpen(true);
            }}
          >
            <Ionicons name="menu" size={24} color="black" />
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
            style={styles.loginButton}
            onPress={() => {
              router.navigate(`/login`);
            }}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        )}
      </BlurView>
      {isLoggedIn ? (
        <MaterialTopTabs
          screenOptions={{
            lazy: true, // 탭 이동시 렌더링 (렌더링 최적화)
            tabBarStyle: {
              backgroundColor: "white",
              shadowColor: "transparent",
              position: "relative",
            },
            tabBarPressColor: "transparent",
            tabBarActiveTintColor: "#555",
            tabBarIndicatorStyle: {
              backgroundColor: "black",
              height: 1,
            },
            tabBarIndicatorContainerStyle: {
              backgroundColor: "#aaa",
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
    backgroundColor: "black",
    borderRadius: 10,
    position: "absolute",
    right: 16,
  },
  loginButtonText: {
    color: "white",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  menuButton: {
    padding: 8,
    position: "absolute",
    left: 16,
  },
});
