import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  description: string;
  profileImageUrl: string;
}

export const AuthContext = createContext<{
  user?: User | null;
  login?: () => void;
  logout?: () => void;
}>({
  user: null,
});
export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "jiwonii",
        password: "123456",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        return Promise.all([
          SecureStore.setItemAsync("accessToken", data.accessToken),
          SecureStore.setItemAsync("refreshToken", data.refreshToken),
          AsyncStorage.setItem("user", JSON.stringify(data.user)),
        ]);
      })
      .then(() => {
        router.push("/(tabs)");
      })
      .catch(console.error);
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem("user");
    SecureStore.deleteItemAsync("accessToken");
    SecureStore.deleteItemAsync("refreshToken");
  };

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      if (user) {
        setUser(JSON.parse(user));
      }
    });
    // TODO: 토큰 유효성 검사
  }, []);

  return (
    <AuthContext value={{ user, login, logout }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AuthContext>
  );
}
