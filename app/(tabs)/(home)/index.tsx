import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
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
    </View>
  );
}

// StyleSheet: 스타일 캐싱처리 최적화
// 숫자: PX 단위가 아닌 DP, DIP, ...등을 따름 (화면 비율에 맞게 디자인)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
