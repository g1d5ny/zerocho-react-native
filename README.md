# 제로초 React Native 강의

## Section 1

`npx expo install:check`: Expo 프로젝트에서 설치된 패키지들의 호환성을 유지하며 업데이트하기 위해 권장되는 명령어

## Section 2

### Expo Router

Expo Router: React Native 및 웹 애플리케이션을 위한 파일 기반 라우터

앱 디렉터리에 파일이 추가되면 해당 파일은 자동으로 내비게이션의 경로가 됨.\
Expo Router에서 URL 경로가 결정되는 가장 기본적인 원리: **파일 시스템의 폴더 및 파일 구조**

**\_layout**: 해당 디렉토리 내 라우트들의 공통 부모 레이아웃 제공\
**(그룹폴더)**: URL에는 영향을 주지 않으면서 특정 라우트 그룹에 레이아웃이나 설정을 적용

**router method**\
`push`: 현재 화면 위에 새 화면을 쌓아 네비게이션 기록에 추가\
`replace`: 현재 화면을 새 화면으로 대체하여 기록에 쌓지 않음. 뒤로 가기 동작에 영향을 줌.

### Animated

1. 메서드

   - delay: 앞 -> 뒤 수행 간격 (비동기 수행)
   - parallel: 동시에 수행 (동기 수행)
   - sequence: 순서대로 수행 (비동기 수행)
   - stageer: parallel + delay (일정한 간격을 두고 순서대로 수행) (동기 수행)
   - spring: 1 -> 2.1 -> 1.9 -> 2
   - decay: 1 -> 1.5 -> 1.8 -> 1.9 -> 2
   - timing: 1 -> 1.2 -> 1.4 -> 1.6 -> 1.8 -> 2 (커스텀 가능)

2. 속성
   - `useNativeDriver: true`: js 스레드가 아닌 gpu 렌더링 사용 (js blocking 방지)
   - `speed: ${friction}`, // friction이 높을수록 스프링 효과 적음 (4 기본 정도로 적당)

## Section 3

### miragejs

mirage: 서버 모킹 라이브러리. fetch 요청을 가로채서 가짜 API 응답 반환\
(실무에서는 api가 나오기 전에 내가 임시로 데이터 설정하여 UI 작업할 수 있음.)

#### fetch
1. 자바스크립트 내장 API
2. response json 변환 필요
3. 복잡한 처리가 힘들어 간단한 요청에 유리

#### axios
1. http 관련 라이브러리
2. response json 자동 변환
3. 에러처리, 인터셉터 등 복잡한 API 통신에 유리

### SecureStore

기기 내 민감한 정보 영구히 저장하는 저장소 (토큰, 비밀번호 등)\
(실무에서는 accessToken, refreshToken 등을 SecureStore에 저장할 수 있음.)

### @react-navigation/material-top-tabs

스와이프 되는 탭 네비게이션\
lazy: 탭이 활성화 될 떄까지 해당 화면의 렌더링을 지연시킴 (렌더링 최적화)
lazyPreloadDistance: 현재 활성 탭으로부터 몇개 탭 거리까지만 미리 로드할지 / lazyPreloadDistance를 설정하지 않아도 lazy가 true이면 탭 이동 중에 옆 탭의 데이터를 미리 불러올 수 있음

### uri-scheme

**딥 링크**

1. 앱이 설치된 경우 원하는 경로로 이동 가능
   Android: App Link
   iOS: Universal Link

2. 앱이 미설치된 경우\

   - Andorid, iOS 추가적인 설정 필요

   - 앱을 설치하고 다시 원하는 경로로 이동\
     솔루션 사용 (Dynamic Link, Branch, ...)

3. 앱을 호출하는 스키마\

- scheme: jiwonii -> 주소 jiwonii://
- scheme 없는 경우\
  android : com.jiwonii.threads://
  ios: bundleIdentifier://

4. 딥링킹 이동하는 방법
   const url = notification.request.content.data?.url;
   // 방법 1
   router.push(url.replace("threadc://", "") as Href);

   // 방법 2
   Linking.openURL(url);

### 다크모드

1. 다크모드 설정하는 명령어\
   android 다크모드로 변경하는 명령어: `adb shell cmd uimode night yes` (yes or no)
   ios 다크모드로 변경하는 명령어: `xcrun simctl ui booted appearance dark` (dark or light)
   `app.json` 내 userInterfaceStyle: uimode 설정값

2. 앱 내 다크모드 변경 메서드
   `Apperance.setColorScheme('dark')`

### 스플래시 스크린 커스터마이징

0. expo에서 스플래시 로고 출력
1. 코드에서 스플래시 로고 출력
2. 앱 준비 시작
3. expo에서 띄운 스플래시 로고 사라짐
4. 앱 준비 완료
5. 스플래시 로고 애니메이션 동작 시작
6. 스플래시 로고 애니메이션 완료
7. 스플래시 사라짐

### 인앱브라우저

app.json 내 속성 `experimentalLauncherActivity: true`로 하면 안드로이드에서 앱을 백그라운드로 내려도 인앱브라우저 유지

`WebBrowser.openAuthSessionAsync(url, redirectUrl, options)`: 소셜 로그인 시 뜨는 브라우저를 인앱브라우저로 대

인앱브라우저 vs. 웹뷰\
**인앱브라우저: API**\
**웹뷰: 컴포넌트 (앱 내에 웹사이트를 내장)**

## Section 4
### FlatList : RN의 기본 가상화 리스트인 VirtualizedList를 기반으로 한 리스트 뷰
1. lazy Loading: 화면에 보이는 아이템 + 약간의 버퍼만 메모리에 둠
2. 아이템 크기를 스크롤 할 때마다 측정해야함
  => 리스트가 길어질수록 측정 지연, 빈 화면 같은 현상이 생김
3. 재사용 X: 안보이는 아이템을 unmount -> 다시 mount
   => 메모리 chrun (메모리 할당/해제 자주 일어나는 현상) 발생
4. windowSize 속성: 한 화면에 몇 배수의 아이템을 메모리에 유지할지 정하는 속성
  - 스크롤을 빨리 하든, 천천히 하든, 위아래로 항상 같은 양의 버퍼만 렌더링
  - windowSize가 작으면 -> 스크롤 빠르게 할 때 빈 화면 생김
  - windowSize가 크면 -> 메모리 과다 사용, 불필요한 render 발생

### FlashList
1. FlatList보다 성능 좋은 리스트뷰 (FlatList의 한계가 보완돼서 나옴)
   - 정확한 아이템 크기 추정: 초기에 한 번만 아이템 크기를 측정하고 이후에는 캐싱된 크기를 사용함
   - estimatedItemSize 속성을 이용하여 더 빠르게 레이아웃 계산
     => 스크롤할 때 매번 측정하는 비용 제거
   - 셀 재사용: 네이티브 (UITableView, RecyclerView)처럼 컴포넌트를 재사용함
   - 화면 밖으로 스크롤된 아이템은 숨김 처리 후 재활용 pool에 넣고, 새 아이템이 필요하면 pool에서 꺼내 데이터만 바꿔줌
     => mount/unmount 반복이 사라져 메모리 churn 줄고, CPU 사용도 감소
   - 렌더링 최적화: 화면에 필요한 것만 미리 정확히 렌더링 -> 불필요한 React reconciliation 줄어듦
   - Window 관리 개선: FlatList는 단순히 windowSize 버퍼만 사용하지만, FlashList는 동적 window 관리를 함

     #### 동적 window 원리
     1. 스크롤 속도 기반으로 window 크기를 조절
       - 사용자가 천천히 스크롤 -> 작은 window로도 충분
       - 사용자가 빨리 스크롤 -> window 크기를 순간적으로 늘려서, 미리 더 많은 아이템을 렌더링 -> blank 없이 매끄럽게 보임
     2. 방향성 고려
       - 지금 스크롤하는 방향을 감지해서 스크롤할 가능성이 높은 쪽에 더 많은 아이템을 준비하고 반대쪽은 줄임
     3. 화면 크기 / density 반영
       - 태블릿과 같은 큰 화면에서는 더 많은 아이템을 한 번에 보이니까 window도 유연하게 늘려줌
   
2. ver 1, 2가 있음. 2는 아직 알파 단계로 실무에서는 아직 적용 불가
3. ver 2는 없어진 속성들이 많음. 그 중에서 estimatedSize가 있는데, 2에선 개발자가 속성을 지정하지 않아도 FlashList에서 알아서 최적화를 해줌
4. expo53은 ver1을 씀 (ver2 안정화 이슈로)
5. 새로운 아키텍쳐를 사용함
6. keyExtractor가 필요 없음

### Animation
1. useSharedValue
  - 애니메이션 처리를 할 때 사용하는 값
  -  JS 스레드가 아닌 UI 스레드에서 동작함
  -  JS와 Native 스레드 간 공유 가능

2. panResponder
   - Pan: 터치 스크린에서 손가락을 드래그하는 동작
   - Responder: 이벤트에 반응하는 컴포넌트
   - PanResponder를 useRef로 감쌈으로써 패닝 이벤트를 받아서 애니메이션 처리를 할 수 있게 해줌
   - onStartShouldSetPanResponder
     - true -> 패닝 이벤트를 받아서 애니메이션 처리를 할 수 있게 해줌
     - false -> 패닝 이벤트를 받지 않음
  - onPanResponderMove: 패닝 이벤트가 발생할 때 마다 호출됨
  - onPanResponderRelease: 패닝 이벤트가 끝났을 때 호출됨
  - onPanResponderTerminate: 패닝 이벤트가 중단되었을 떄 호출됨

3. useAnimatedScrollHandler: 스크롤 이벤트를 받아서 애니메이션 처리를 할 수 있게 도와줌

## Section 5
### Push Notification
1. Local Notification
   - 앱 내부에서 생성되고 처리되는 알림
   - 앱이 실행 중이거나 백그라운드에 있을 때 생성
   - 사용자의 기기에서 직접 처리
   - 인터넷 연결 필요 없음
   - ex) 타이머, 알람, 일정 리마인더 등
2. Remote Notification
  - 서버에서 전송되는 알림
  - 서버에서 메시지 처리
  - 앱이 종료되어 있어도 수신 가능
  - 인터넷 연결 필요
  - ex) 소셜 미디어 알림, 채팅 등

### 각종 빌드 정리
1. Expo Go
   - Metro (Dev Server) + Dev App (Native X)
   - npx expo start --android
2. Development builds
   - Metro (Dev Server) + Dev App (Native O + prebuild)
   - npx expo start
   - eas build --profile development --platform android (release용)
   - npx expo run:android (development용)
3. Prebuild
   - android, ios folder generate
4. Preview/Production builds
   - eas build --platform android
   - production ready
   - Metro Server X -> Your backend server
   - MirageJS disable (if(__DEV__) 사용 필요)

### 환경변수
1. .env.local이 .env보다 우선순위가 더 높음
2. 환경 변수 지정하는 방법
   - process.env.EXPO_PUBLIC_KAKAO_APP_KEY (is defined in .env.local or .env)
   - Constants.expoConfig?.extra?.kakaoAppKey (is defined in app.config.js)
3. app.config.js extras: 정말 민감한 비밀 값(예: 백엔드 서버 관리자 키)을 Expo 앱 내에서 관리할 때 노출 위험이 있어 가장 권장되지 않는 방식
5. app.json vs. app.config.js
  - app.json
    1. 순수한 JSON 형식의 설정 파일
    2. 환경 변수 사용 불가 (-> app.config.js에서 사용해야함)
    3. expo 설정에 적합
  - app.config.js
    1. js 코드를 실행할 수 있는 설정 파일
    2. process.env를 통해 환경 변수 사용 가능
    3. 런타임에 설정 값 계산 가능
5. 이슈: eas build할 떄, 환경 변수가 git으로 인식되지 않으면 반영이 안되는 이슈가 있음
  해결 방법 1: expo 홈페이지에서 환경변수 입력란에 환경변수 추가함
  해결 방법 2: .env를 git에 잠시 인식되도록 하고 eas build 후 .env를 다시 gitignore

### Expo Modules
expo module 생성하는 법
1. npx create-expo-module@latest (--local)
2. npx expo install expo-modules-core
