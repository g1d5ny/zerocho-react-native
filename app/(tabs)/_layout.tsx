import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function TabLayout() {
  const router = useRouter();
  const isLoggedIn = false;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const toLoginPage = () => {
    closeLoginModal();
    router.navigate("/login");
  };

  const AnimatedTabBarButton = ({
    children,
    onPress,
    style,
    ...restProps
  }: BottomTabBarButtonProps) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressOut = () => {
      // delay: 앞 -> 뒤 수행 간격 (비동기 수행)
      // parallel: 동시에 수행 (동기 수행)
      // sequence: 순서대로 수행 (비동기 수행)
      // stageer: parallel + delay (일정한 간격을 두고 순서대로 수행) (동기 수행)
      Animated.sequence([
        // spring: 1 -> 2.1 -> 1.9 -> 2
        // decay: 1 -> 1.5 -> 1.8 -> 1.9 -> 2
        // timing: 1 -> 1.2 -> 1.4 -> 1.6 -> 1.8 -> 2 (커스텀 가능)
        Animated.spring(scaleValue, {
          toValue: 1.2,
          useNativeDriver: true, // js 스레드가 아닌 gpu 렌더링 사용 (js blocking 방지)
          speed: 200,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          speed: 200, // friction이 높을수록 스프링 효과 적음 (4 기본 정도로 적당)
        }),
      ]).start();
    };
    return (
      <Pressable
        {...restProps}
        onPress={onPress}
        onPressOut={handlePressOut}
        style={[
          { flex: 1, justifyContent: "center", alignItems: "center" },
          style,
        ]}
        android_ripple={{ borderless: false, radius: 0 }}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          {children}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="search"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              console.log("isLoggedIn: ", isLoggedIn);
              if (isLoggedIn) {
                router.navigate("/modal");
              } else {
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="add"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="heart-outline"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="[username]"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person-outline"
                size={24}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(post)/[username]/post/[postID]"
          options={{
            // tabBarLabel: () => null,
            href: null,
          }}
        />
      </Tabs>
      <Modal visible={isLoginModalOpen} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              padding: 20,
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={toLoginPage}>
              <Text>Login Modal</Text>
            </Pressable>
            <TouchableOpacity onPress={closeLoginModal}>
              <Ionicons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
