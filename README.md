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

### FlashList
1. FlatList보다 성능 좋은 리스트뷰 (어떤점이 더 좋은지 공부 필요)
2. ver 1, 2가 있음. 2는 아직 알파 단계로 실무에서는 아직 적용 불가
3. ver 2는 없어진 속성들이 많음. 그 중에서 estimatedSize가 있는데, 2에선 개발자가 속성을 지정하지 않아도 FlashList에서 알아서 최적화를 해줌
4. expo53은 ver1을 씀 (ver2 안정화 이슈로)
5. 새로운 아키텍쳐를 사용함
6. keyExtractor가 필요 없음
