import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Href, router, Stack } from "expo-router";
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
  handleSuccess(notificationId) {
    console.log("handleSuccess", notificationId);
  },
  handleError(notificationId, error) {
    console.log("handleError", notificationId, error);
  },
});

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === "string" && url.startsWith("threadc://")) {
        // 방법 1
        router.push(url.replace("threadc://", "") as Href);
        // 방법 2
        // Linking.openURL(url);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
}

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
  updateUser?: (user: User) => void;
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
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      setSplashReady(true);
    }
    prepare();
  }, [image]);

  const login = () => {
    console.log("login");
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "jiwonii",
        password: "123456",
      }),
    })
      .then((res) => {
        console.log("res", res, res.status);
        if (res.status >= 400) {
          return Alert.alert("Error", "Invalid credentials");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
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

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((res) => res.json())
    .then((data) => console.log("111data: ", data));
}

function AnimatedSplashScreen({
  children,
  image,
}: {
  children: React.ReactNode;
  image: number;
}) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const { updateUser } = useContext(AuthContext);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useNotificationObserver();

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = async () => {
    try {
      // 데이터 준비
      await Promise.all([
        AsyncStorage.getItem("user").then((user) => {
          updateUser?.(user ? JSON.parse(user) : null);
        }),
        // TODO: 토큰 유효성 검사
      ]);
      await SplashScreen.hideAsync();
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        return Linking.openSettings();
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId,
      });
      console.log("token", token);
      // TODO: save token to server
      setExpoPushToken(token.data);
    } catch (e) {
      console.error(e);
    } finally {
      setAppReady(true);
    }
  };

  useEffect(() => {
    if (expoPushToken && Device.isDevice) {
      sendPushNotification(expoPushToken);
    }
  }, [expoPushToken]);

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
            {
              ...StyleSheet.absoluteFillObject,
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
