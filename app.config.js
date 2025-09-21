export default {
  expo: {
    name: "threads",
    slug: "threads",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/avatar.png",
    scheme: "threads",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.jiwoniii.threads",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      runtimeVersion: "1.0.0",
    },
    updates: {
      url: "https://u.expo.dev/1f6f26aa-c843-46fe-b90a-e45d41473423",
    },
    android: {
      runtimeVersion: {
        policy: "appVersion",
      },
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.jiwoniii.threads",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    splash: {
      image: "./assets/images/react-logo.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app needs access to your photos to let you share them with your threads.",
          cameraPermission:
            "The app needs access to your camera to let you share them with your threads.",
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission:
            "The app needs access to your photos to let you share them with your threads.",
          cameraPermission:
            "The app needs access to your camera to let you share them with your threads.",
          isAccessMediaLocationEnabled: true,
        },
      ],
      [
        "expo-web-browser",
        {
          experimentalLauncherActivity: true,
        },
      ],
      "expo-secure-store",
      "expo-build-properties",
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://devrepo.kakao.com/nexus/content/groups/public/",
            ],
          },
        },
      ],
      [
        "@react-native-kakao/core",
        {
          nativeAppKey: "2d6a890ed320e205e6de1a17f7230856",
          android: {
            authCodeHandlerActivity: true,
          },
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      kakaoAppKey: "2d6a890ed320e205e6de1a17f7230856",
      router: {},
      eas: {
        projectId: "1f6f26aa-c843-46fe-b90a-e45d41473423",
      },
    },
  },
};
