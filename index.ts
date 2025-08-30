import { faker } from "@faker-js/faker";
import "expo-router/entry";
import {
  belongsTo,
  createServer,
  Factory,
  hasMany,
  Model,
  Response,
  RestSerializer,
  Server,
} from "miragejs";

declare global {
  interface Window {
    server: Server;
  }
}

let jiwonii: any;

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    // 모델은 데이터를 정의할 때 사용되는 함수
    models: {
      user: Model.extend({
        posts: hasMany("post"), // 유저는 여러 개의 포스트를 가질 수 있음 (1:다)
        activities: hasMany("activity"), // 유저는 여러 개의 활동을 가질 수 있음 (1:다)
      }),
      post: Model.extend({
        user: belongsTo("user"), // 포스트는 하나의 유저를 가질 수 있음 (1:1)
      }),
      activity: Model.extend({
        user: belongsTo("user"), // 활동은 하나의 유저를 가질 수 있음 (1:1)
      }),
    },
    serializers: {
      post: RestSerializer.extend({
        include: ["user"], // 포스트는 유저를 포함할 수 있음 (1:1)
        embed: true,
      }),
      activity: RestSerializer.extend({
        include: ["user"], // 활동은 유저를 포함할 수 있음 (1:1)
        embed: true,
      }),
    },
    // 팩토리는 데이터를 생성할 때 사용되는 함수
    factories: {
      user: Factory.extend({
        id: () => faker.person.firstName(),
        name: () => faker.person.fullName(),
        nickname: () => faker.person.middleName(),
        description: () => faker.lorem.sentence(),
        profileImageUrl: () =>
          `https://avatars.githubusercontent.com/u/${Math.floor(
            Math.random() * 100_000
          )}?v=4`,
        isVerified: () => Math.random() > 0.5,
        followersCount: () => Math.floor(Math.random() * 1000),
        followingCount: () => Math.floor(Math.random() * 1000),
        isFollowing: () => Math.random() > 0.5,
      }),
      post: Factory.extend({
        id: () => faker.string.numeric(6),
        content: () => faker.lorem.paragraph(),
        imageUrls: () =>
          Array.from({ length: Math.floor(Math.random() * 3) }, () =>
            faker.image.urlLoremFlickr()
          ),
        likes: () => Math.floor(Math.random() * 100),
        comments: () => Math.floor(Math.random() * 100),
        reposts: () => Math.floor(Math.random() * 100),
      }),
      activity: Factory.extend({
        id: () => faker.string.numeric(6),
        content: () => faker.lorem.paragraph(),
        imageUrls: () =>
          Array.from({ length: Math.floor(Math.random() * 3) }, () =>
            faker.image.urlLoremFlickr()
          ),
        type: () =>
          faker.helpers.arrayElement([
            "follows",
            "replies",
            "mentions",
            "quotes",
            "reposts",
            "verified",
          ]),
        createdAt: () => faker.date.recent().toISOString(),
        username: () => faker.person.fullName(),
        avatar: () =>
          `https://avatars.githubusercontent.com/u/${Math.floor(
            Math.random() * 100_000
          )}?v=4`,
        otherCount: () => Math.floor(Math.random() * 100),
        link: () => faker.internet.url(),
        reply: () => faker.lorem.sentence(),
        likes: () => Math.floor(Math.random() * 100),
        replies: () => Math.floor(Math.random() * 100),
        reposts: () => Math.floor(Math.random() * 100),
        shares: () => Math.floor(Math.random() * 100),
        postId: () => faker.string.numeric(6),
      }),
    },
    // 시드는 데이터를 생성할 때 사용되는 함수
    seeds(server) {
      jiwonii = server.create("user", {
        id: "jiwon",
        name: "jiwonii",
        description: "I'm jieonist.",
        profileImageUrl: "https://avatars.githubusercontent.com/u/885857?v=4",
      });
      const users = server.createList("user", 10);
      users.forEach((user) => {
        server.createList("post", 5, {
          user,
        });
      });
      server.createList("post", 5, {
        user: jiwonii,
      });
      /// 미션 코드
      server
        .createList("activity", 10, {
          user: users[0],
        })
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

      // users.forEach((user) => {
      //   server.createList("activity", 5, {
      //     user,
      //   });
      // });
    },
    // 라우트는 데이터를 전달할 때 사용되는 함수
    routes() {
      this.post("/posts", (schema, request) => {
        const { posts } = JSON.parse(request.requestBody);
        posts.forEach((post: any) => {
          schema.create("post", {
            content: post.content,
            imageUrls: post.imageUrls,
            location: post.location,
            user: schema.find("user", "jiwon"),
          });
        });
        return posts;
      });

      this.get("/posts", (schema, request) => {
        let posts = schema.all("post");
        if (request.queryParams.type === "following") {
          posts = posts.filter((post) => post.user?.id === jiwonii?.id);
        }
        let targetIndex = -1;
        if (request.queryParams.cursor) {
          targetIndex = posts.models.findIndex(
            (v) => v.id === request.queryParams.cursor
          );
        }
        return posts.slice(targetIndex + 1, targetIndex + 11);
      });

      this.get("/posts/:id", (schema, request) => {
        return schema.find("post", request.params.id);
      });

      this.get("/posts/:id/comments", (schema, request) => {
        const comments = schema.all("post");
        let targetIndex = -1;
        if (request.queryParams.cursor) {
          targetIndex = comments.models.findIndex(
            (v) => v.id === request.queryParams.cursor
          );
        }
        return comments.slice(targetIndex + 1, targetIndex + 11);
      });

      this.get("/users/:id", (schema, request) => {
        return schema.find("user", request.params.id.slice(1));
      });

      this.get("/activity", (schema, request) => {
        const activity = schema.all("activity").models;
        return new Response(200, {}, { activity });
      });

      this.get("/users", (schema, request) => {
        const users = schema.all("user").models;
        return new Response(200, {}, { users });
      });

      this.post("/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        if (username === "jiwonii" && password === "123456") {
          return {
            accessToken: "access-token",
            refreshToken: "refresh-token",
            user: {
              id: "jiwon",
              name: "jiwonii",
              description: "jiwonii's description",
              profileImageUrl:
                "https://avatars.githubusercontent.com/u/885857?v=4",
            },
          };
        } else {
          return new Response(401, {}, { message: "Invalid credentials" });
        }
      });
    },
  });
}
