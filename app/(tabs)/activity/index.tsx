import NotFound from "@/app/+not-found";
import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../_layout";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  if (
    ![
      "/activity",
      "/activity/replies",
      "/activity/reposts",
      "/activity/mentions",
      "/activity/quotes",
      "/activity/verified",
    ].includes(pathname)
  ) {
    return <NotFound />;
  }
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
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
      </View>
      <View style={styles.tabBar}>
        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity`)}>
            <Text
              style={{ color: pathname === "(`/activity" ? "red" : "black" }}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity/replies`)}>
            <Text style={{ color: pathname === "/replies" ? "red" : "black" }}>
              Follows
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity/reposts`)}>
            <Text style={{ color: pathname === "/reposts" ? "red" : "black" }}>
              Replies
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => router.replace(`/activity/mentions`)}
          >
            <Text style={{ color: pathname === "/mentions" ? "red" : "black" }}>
              Mentions
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity/quotes`)}>
            <Text style={{ color: pathname === "/quotes" ? "red" : "black" }}>
              Quotes
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.replace(`/activity/reposts`)}>
            <Text style={{ color: pathname === "/reposts" ? "red" : "black" }}>
              Reposts
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => router.replace(`/activity/verified`)}
          >
            <Text style={{ color: pathname === "/verified" ? "red" : "black" }}>
              Verified
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    height: 50,
  },
  menuButton: {
    position: "absolute",
    left: 20,
    top: 10,
  },
  container: {
    flex: 1,
  },
});
