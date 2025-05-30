import "expo-router/entry";
import { createServer, Response, Server } from "miragejs";

declare global {
  interface Window {
    server: Server;
  }
}

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
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
