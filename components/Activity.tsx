import { getTimeAgo } from "@/utils";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export interface ActivityItemProps {
  id: string;
  username: string;
  otherCount?: number;
  createdAt: string;
  content: string;
  type: string;
  link?: string;
  reply?: string;
  likes?: number;
  reposts?: number;
  comments?: number;
  shares?: number;
  actionButton?: React.ReactNode;
  avatar: string;
  postId?: string;
}

interface Icon {
  color: string;
  name: string;
  component: any;
}

const iconMap: Record<string, Icon> = {
  follows: {
    color: "#FF9500",
    name: "person",
    component: Ionicons,
  },
  mentions: {
    color: "#FF3B30",
    name: "at",
    component: FontAwesome,
  },
  comments: {
    color: "#007AFF",
    name: "reply",
    component: FontAwesome,
  },
  quotes: {
    color: "#007AFF",
    name: "quote-left",
    component: FontAwesome,
  },
  replies: {
    color: "#007AFF",
    name: "reply",
    component: FontAwesome,
  },
  reposts: {
    color: "#007AFF",
    name: "retweet",
    component: FontAwesome,
  },
  verified: {
    color: "#007AFF",
    name: "check-circle",
    component: FontAwesome,
  },
};

export default function ActivityItem({
  username,
  otherCount,
  content,
  type,
  link,
  reply,
  likes,
  reposts,
  comments,
  shares,
  createdAt,
  actionButton,
  avatar,
  postId,
}: ActivityItemProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  // 알림 항목 클릭 시 이동 로직
  const handleItemPress = () => {
    if (type === "follow" || type === "followed") {
      // 팔로우/팔로워 알림은 프로필로 이동
      router.push(`/${username}`);
    } else if (postId) {
      // 나머지 알림은 게시글로 이동 (postId가 있는 경우)
      router.push(`/${username}/post/${postId}`);
    } else {
      // postId가 없는 경우 (예: mention 등 특정 타입) 프로필로 이동하거나 다른 처리
      console.log(
        `No postId for activity type: ${type}, navigating to profile`
      );
      router.push(`/${username}`);
    }
  };

  // 프로필 사진 클릭 시 이동 로직
  const handleAvatarPress = () => {
    router.push(`/${username}`);
  };

  const IconColor = iconMap[type].color;
  const IconComponent = iconMap[type].component;

  return (
    <Pressable onPress={handleItemPress} style={styles.activityItemContainer}>
      {/* Avatar + Icon Container */}
      <Pressable onPress={handleAvatarPress} style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={[styles.iconCircle, { backgroundColor: IconColor }]}>
          {IconComponent && (
            <IconComponent name={iconMap[type].name} size={12} color="white" />
          )}
        </View>
      </Pressable>
      {/* Content Container */}
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text
            style={[
              styles.username,
              colorScheme === "dark"
                ? styles.usernameDark
                : styles.usernameLight,
            ]}
          >
            {username}
          </Text>
          {otherCount && <Text style={styles.otherCount}>+{otherCount}명</Text>}
          <Text style={[styles.timeAgo]}>{getTimeAgo(createdAt)}</Text>
        </View>

        {type === "followed" ? (
          <Text
            style={[
              styles.activityText,
              colorScheme === "dark"
                ? styles.activityTextDark
                : styles.activityTextLight,
            ]}
          >
            Followed you
          </Text>
        ) : (
          <Text
            numberOfLines={3}
            style={[
              styles.activityText,
              colorScheme === "dark"
                ? styles.activityTextDark
                : styles.activityTextLight,
            ]}
          >
            {content}
          </Text>
        )}
        {link && (
          <View style={styles.linkContainer}>
            <FontAwesome name="link" size={14} color="#007AFF" />
            <Text style={styles.linkText}>{link}</Text>
          </View>
        )}
        {reply && (
          <View style={styles.replyContainer}>
            <Text
              style={[
                styles.replyText,
                colorScheme === "dark"
                  ? styles.replyTextDark
                  : styles.replyTextLight,
              ]}
            >
              {reply}
            </Text>
          </View>
        )}
        <View style={styles.activityFooter}>
          {likes !== undefined && (
            <View style={styles.actionContainer}>
              <Feather name="heart" size={20} color="#666" />
              <Text style={styles.actionText}>{likes}</Text>
            </View>
          )}
          {comments !== undefined && (
            <View style={styles.actionContainer}>
              <Feather name="message-circle" size={20} color="#666" />
              <Text style={styles.actionText}>{comments}</Text>
            </View>
          )}
          {reposts !== undefined && (
            <View style={styles.actionContainer}>
              <Feather name="repeat" size={20} color="#666" />
              <Text style={styles.actionText}>{reposts}</Text>
            </View>
          )}
          {shares !== undefined && (
            <View style={styles.actionContainer}>
              <Feather name="send" size={20} color="#666" />
              <Text style={styles.actionText}>{shares}</Text>
            </View>
          )}
          {actionButton && actionButton}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activityItemContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "flex-start",
  },
  avatarContainer: {
    marginRight: 12,
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -2,
    right: -2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 4,
  },
  usernameDark: {
    color: "white",
  },
  usernameLight: {
    color: "black",
  },
  otherCount: {
    fontSize: 14,
    marginRight: 4,
  },
  otherCountDark: {
    color: "white",
  },
  otherCountLight: {
    color: "#888",
  },
  timeAgo: {
    fontSize: 14,
    color: "gray",
  },
  activityText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  activityTextDark: {
    color: "#ccc",
  },
  activityTextLight: {
    color: "#333",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
  },
  linkText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#007AFF",
    flexShrink: 1,
  },
  replyContainer: {
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#ddd",
    paddingLeft: 8,
  },
  replyText: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
  replyTextDark: {
    color: "#ccc",
  },
  replyTextLight: {
    color: "#555",
  },
  activityFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  followBackButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: "auto",
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
