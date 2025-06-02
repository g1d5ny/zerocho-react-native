import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../_layout";

interface User {
  id: string;
  name: string;
  nickname: string;
  description: string;
  profileImageUrl: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <View
        style={[
          styles.header,
          colorScheme === "dark" ? styles.headerDark : styles.headerLight,
        ]}
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
              color={colorScheme === "dark" ? "gray" : "black"}
            />
          </Pressable>
        )}
        <Image
          source={require("../../assets/images/react-logo.png")}
          style={styles.logo}
        />
        <SideMenu
          isVisible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
      </View>
      <View
        style={[
          styles.searchBarArea,
          colorScheme === "dark"
            ? styles.searchBarAreaDark
            : styles.searchBarAreaLight,
        ]}
      >
        <View
          style={[
            styles.searchBar,
            colorScheme === "dark"
              ? styles.searchBarDark
              : styles.searchBarLight,
          ]}
        >
          <Ionicons
            name="search"
            size={24}
            color={colorScheme === "dark" ? "gray" : "black"}
          />
          <TextInput
            style={[
              styles.searchInput,
              colorScheme === "dark"
                ? styles.searchInputDark
                : styles.searchInputLight,
            ]}
            placeholder="Search"
            placeholderTextColor={colorScheme === "dark" ? "gray" : "black"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <ScrollView style={styles.usersContainer}>
        {users
          .filter((users) => users.id !== user?.id)
          .map((user) => {
            return (
              <View key={user.id} style={styles.userContainer}>
                <Image
                  source={{ uri: user.profileImageUrl }}
                  style={styles.profileImage}
                />
                <View style={styles.userInfoContainer}>
                  <View style={styles.userInfo}>
                    <Text
                      style={[
                        styles.userName,
                        colorScheme === "dark"
                          ? styles.userNameDark
                          : styles.userNameLight,
                      ]}
                    >
                      {user.id}
                    </Text>
                    {user.isVerified && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#0095F6"
                        style={styles.verifiedIcon}
                      />
                    )}
                  </View>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.description}
                  >
                    {user.description}
                  </Text>
                  <Text
                    style={[
                      styles.followersCount,
                      colorScheme === "dark"
                        ? styles.followersCountDark
                        : styles.followersCountLight,
                    ]}
                  >
                    팔로워 {user.followersCount}명
                  </Text>
                </View>
                <Pressable
                  style={[
                    styles.followButton,
                    {
                      backgroundColor:
                        colorScheme === "dark" ? "white" : "black",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.followingText,
                      {
                        color: colorScheme === "dark" ? "black" : "white",
                      },
                    ]}
                  >
                    {user.isFollowing ? "팔로우 취소" : "팔로우"}
                  </Text>
                </Pressable>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  followingText: {
    fontWeight: "bold",
  },
  followersCount: {
    color: "gray",
  },
  followersCountDark: {
    color: "white",
  },
  followersCountLight: {
    color: "black",
  },
  userNameDark: {
    color: "white",
  },
  userNameLight: {
    color: "black",
  },
  description: {
    color: "gray",
    marginRight: 10,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  followButton: {
    padding: 10,
    borderRadius: 5,
  },
  userName: {
    fontWeight: "bold",
  },
  userInfoContainer: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  usersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  headerLight: {
    backgroundColor: "white",
  },
  headerDark: {
    backgroundColor: "#101010",
  },
  menuButton: {
    position: "absolute",
    left: 16,
  },
  searchBarArea: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  searchBarAreaLight: {
    backgroundColor: "white",
  },
  searchBarAreaDark: {
    backgroundColor: "#202020",
  },
  searchBar: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 30,
  },
  searchBarLight: {
    backgroundColor: "white",
  },
  searchBarDark: {
    backgroundColor: "black",
    color: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#aaa",
  },
  searchInput: {
    marginLeft: 10,
  },
  searchInputLight: {
    color: "black",
  },
  searchInputDark: {
    color: "white",
  },
});
