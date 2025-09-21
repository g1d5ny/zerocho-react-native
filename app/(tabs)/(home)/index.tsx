import Post, { type Post as PostType } from "@/components/Post";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { usePathname } from "expo-router";
import { useCallback, useContext, useRef, useState } from "react";
import { PanResponder, StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimationContext } from "./_layout";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<PostType>);

export default function Index() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const [posts, setPosts] = useState<PostType[]>([]);
  // useSharedValue 설명
  // 1. 애니메이션 처리를 할 때 사용하는 값
  // 2. JS 스레드가 아닌 UI 스레드에서 동작함
  // 3. JS와 Native 스레드 간 공유 가능
  const scrollPosition = useSharedValue(0); // 스크롤 위치
  const isReadyToRefresh = useSharedValue(false); // 새로고침 준비 여부
  const { pullDownPosition } = useContext(AnimationContext);

  const onEndReached = useCallback(() => {
    console.log("posts: ", posts);
    console.log("onEndReached", posts.at(-1)?.id);
    // fetch(`/posts?cursor=${posts.at(-1)?.id}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.posts.length > 0) {
    //       setPosts((prev) => [...prev, ...data.posts]);
    //     }
    //   });
  }, [posts, path]);

  const onRefresh = (done: () => void) => {
    setPosts([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (__DEV__) {
      fetch("/posts")
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts);
        })
        .finally(() => {
          done();
        });
    }
  };

  const onPanRelease = () => {
    pullDownPosition.value = withSpring(isReadyToRefresh.value ? 60 : 0, {
      duration: 180,
    });
    if (isReadyToRefresh.value) {
      onRefresh(() => {
        pullDownPosition.value = withSpring(0, { duration: 180 });
      });
    }
  };

  // 패닝 이벤트 핸들러 설명: 패닝 이벤트를 받아서 애니메이션 처리를 할 수 있게 해줌
  const panResponderRef = useRef(
    PanResponder.create({
      // onStartShouldSetPanResponder 속성이 true를 반환하면 패닝 이벤트를 받아서 애니메이션 처리를 할 수 있게 해줌
      // false를 반환하면 패닝 이벤트를 받지 않음
      onMoveShouldSetPanResponder: () => true,
      // onPanResponderMove 속성 뜻: 패닝 이벤트가 발생할 때 마다 호출됨
      onPanResponderMove: (event, gestureState) => {
        const max = 120;
        pullDownPosition.value = Math.max(Math.min(gestureState.dy, max), 0);
        console.log("pull", pullDownPosition.value);

        if (
          pullDownPosition.value >= max / 2 &&
          isReadyToRefresh.value === false
        ) {
          isReadyToRefresh.value = true;
        }
        if (
          pullDownPosition.value < max / 2 &&
          isReadyToRefresh.value === true
        ) {
          isReadyToRefresh.value = false;
        }
      },
      onPanResponderRelease: onPanRelease, // 패닝 이벤트가 끝났을 때 호출됨
      onPanResponderTerminate: onPanRelease, // 패닝 이벤트가 중단되었을 때 호출됨
    })
  );

  // 스크롤 이벤트 핸들러 설명: 스크롤 이벤트를 받아서 애니메이션 처리를 할 수 있게 해줌
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      console.log("onScroll", event.contentOffset.y);
      scrollPosition.value = event.contentOffset.y;
    },
  });

  const pullDownStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: pullDownPosition.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.containerDark : styles.containerLight,
        pullDownStyles,
      ]}
      {...panResponderRef.current.panHandlers}
    >
      <AnimatedFlashList
        refreshControl={<View />}
        data={posts}
        nestedScrollEnabled={true}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item }) => <Post item={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        estimatedItemSize={350}
      />
    </Animated.View>
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
