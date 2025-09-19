import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login as kakaoLogin, me } from "@react-native-kakao/user";
import * as AppleAuthentication from "expo-apple-authentication";
import { Redirect, router } from "expo-router";
import { useContext, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "./_layout";

export default function Login() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { user, login } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const openKakaoLogin = async () => {
    const result = await kakaoLogin();
    console.log("result: ", result);
    const user = await me();
    console.log("user: ", user);
  };

  const onAppleLogin = async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log("credentials: ", credentials);
    } catch (error) {
      console.error("onAppleLoginerror: ", error);
    }
  };

  useEffect(() => {
    initializeKakaoSDK("2d6a890ed320e205e6de1a17f7230856");
  }, []);

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: insets.top,
        backgroundColor: colorScheme === "dark" ? "black" : "white",
      }}
    >
      <Pressable onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
      <Pressable style={styles.loginButton} onPress={login}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
      <Pressable
        style={[styles.loginButton, styles.kakaoLoginButton]}
        onPress={openKakaoLogin}
      >
        <Text style={[styles.loginButtonText, styles.kakaoLoginButtonText]}>
          Kakao Login
        </Text>
      </Pressable>
      <Pressable
        style={[styles.loginButton, styles.appleLoginButton]}
        onPress={onAppleLogin}
      >
        <Text style={styles.loginButtonText}>Apple Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  kakaoLoginButtonText: {
    color: "black",
  },
  appleLoginButton: {
    backgroundColor: "black",
  },
  kakaoLoginButton: {
    backgroundColor: "yellow",
  },
  loginButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
  },
});
