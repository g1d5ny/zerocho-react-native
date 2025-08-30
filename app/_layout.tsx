import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, Linking, StyleSheet, View } from "react-native";
import Toast, { BaseToast } from "react-native-toast-message";

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, // 소리 재생 여부
    shouldSetBadge: true, // 알람 온 갯수 표시 여부
    shouldShowBanner: true, // 알림 배너 표시 여부
    shouldShowList: true, // 알림 리스트 표시 여부
  }),
});

SplashScreen.preventAutoHideAsync();
export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
  link?: string;
  showInstagramBadge?: boolean;
  isPrivate?: boolean;
}

export const AuthContext = createContext<{
  user: User | null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
  updateUser?: (user: User | null) => void;
}>({
  user: null,
});

function AnimatedAppLoader({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      setIsSplashReady(true);
    }
    prepare();
  }, [image]);

  const login = async () => {
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "jiwonii",
        password: "123456",
      }),
    })
      .then((res) => {
        if (res.status >= 400) {
          return Alert.alert("Error", "Invalid credentials");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync("accessToken", data.accessToken),
          SecureStore.setItemAsync("refreshToken", data.refreshToken),
          AsyncStorage.setItem("user", JSON.stringify(data.user)),
        ]);
      })
      .catch(console.error);
  };

  const logout = () => {
    setUser(null);
    return Promise.all([
      SecureStore.deleteItemAsync("accessToken"),
      SecureStore.deleteItemAsync("refreshToken"),
      AsyncStorage.removeItem("user"),
    ]);
  };

  const updateUser = (user: User | null) => {
    setUser(user);
    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  };

  if (!isSplashReady) {
    return null;
  }

  return (
    <AuthContext value={{ user, login, logout, updateUser }}>
      <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
    </AuthContext>
  );
}

function AnimatedSplashScreen({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [isAppReady, setIsAppReady] = useState(false); // 앱이 준비됐는지
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] =
    useState(false); // 스플래시 애니메이션이 완료됐는지
  const animation = useRef(new Animated.Value(1)).current;
  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        //완료된 후
        setIsSplashAnimationComplete(true);
      });
    }
  }, [isAppReady]);

  const onImageLoaded = async () => {
    try {
      // 데이터 준비
      await Promise.all(
        [
          AsyncStorage.getItem("user").then((user) => {
            updateUser?.(user ? JSON.parse(user) : null);
          }),
        ]
        // TODO: 토큰 유효성 검사
      );
      await SplashScreen.hideAsync();

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        return Linking.openSettings();
      }
      // Second, call scheduleNotificationAsync()
      const notification = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Look at that notification",
          body: "I'm so proud of myself!",
        },
        trigger: null, // 알람이 트리거 되는 상황을 설정. null: 알람이 바로 트리거 됨
      });
      console.log("notification: ", notification);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAppReady(true);
    }
  };

  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                Constants.expoConfig?.splash?.backgroundColor || "#ffffff",
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            source={image}
            style={{
              width: Constants.expoConfig?.splash?.imageWidth || 200,
              height: Constants.expoConfig?.splash?.imageHeight || 200,
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
                { rotate: rotateValue },
              ],
            }}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default function RootLayout() {
  const toastConfig = {
    customToast: (props: any) => (
      <BaseToast
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          height: 40,
          borderLeftWidth: 0,
          shadowOpacity: 0,
          justifyContent: "center",
        }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          alignItems: "center",
          height: 40,
        }}
        text1Style={{
          color: "black",
          fontSize: 14,
          fontWeight: "500",
        }}
        text1={props.text1}
        onPress={props.onPress}
      />
    ),
  };

  return (
    <AnimatedAppLoader image={require("@/assets/images/react-logo.png")}>
      <StatusBar style="auto" animated translucent />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      <Toast config={toastConfig} />
    </AnimatedAppLoader>
  );
}
