import { Redirect } from "expo-router";

// /home -> /
export default function Home() {
  return <Redirect href="/(tabs)" />;
}
