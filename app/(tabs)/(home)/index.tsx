import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = false;
  console.log("pathname", pathname);

  return (
    <SafeAreaView style={styles.container}>
      <BlurView style={styles.header} intensity={70}>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.headerLogo}
        />
        {!isLoggedIn && (
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        )}
      </BlurView>
      {isLoggedIn && (
        <View style={styles.tabContainer}>
          <View style={styles.tab}>
            <TouchableOpacity onPress={() => router.push(`/`)}>
              <Text style={{ color: pathname === "/" ? "red" : "black" }}>
                For you
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tab}>
            <TouchableOpacity onPress={() => router.push(`/following`)}>
              <Text style={{ color: pathname === "/" ? "black" : "red" }}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View>
        <TouchableOpacity onPress={() => router.push(`/@jiwonii/post/1`)}>
          <Text>게시글 1</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@jiwonii/post/2`)}>
          <Text>게시글 2</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push(`/@jiwonii/post/3`)}>
          <Text>게시글 3</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// StyleSheet: 스타일 캐싱처리 최적화
// 숫자: PX 단위가 아닌 DP, DIP, ...등을 따름 (화면 비율에 맞게 디자인)
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  headerLogo: {
    width: 42,
    height: 42,
  },
  loginButton: {
    position: "absolute",
    right: 10,
    top: 0,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: "white",
  },
});
