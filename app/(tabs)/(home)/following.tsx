import Post, { type IPost as PostType } from "@/components/Post";
import { FlashList } from "@shopify/flash-list";
import { usePathname } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

export default function Following() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const [posts, setPosts] = useState<PostType[]>([]);

  const onEndReached = () => {
    fetch(`/posts?type=following&cursor=${posts.at(-1)?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts.length > 0) {
          setPosts((prev) => [...prev, ...data.posts]);
        }
      });
  };

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
      ]}
    >
      <FlashList
        data={posts}
        renderItem={({ item }) => <Post item={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        estimatedItemSize={350}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#101010",
  },
  textLight: {
    color: "black",
  },
  textDark: {
    color: "white",
  },
});
