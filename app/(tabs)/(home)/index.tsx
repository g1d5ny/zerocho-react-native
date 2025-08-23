import Post, { type IPost as PostType } from "@/components/Post";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { usePathname } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onEndReached = () => {
    fetch(`/posts?&cursor=${posts.at(-1)?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts.length > 0) {
          setPosts((prev) => {
            return [...prev, ...data.posts];
          });
        }
      })
      .catch(console.error);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPosts([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetch(`/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .finally(() => {
        setRefreshing(false);
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
        refreshing={refreshing}
        onRefresh={onRefresh}
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
