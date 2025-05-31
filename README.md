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

## Section 3

### miragejs

mirage: 서버 모킹 라이브러리\
(실무에서는 api가 나오기 전에 내가 임시로 데이터 설정하여 UI 작업할 수 있음.)

### SecureStore

기기 내 중요 정보 저장하는 저장소 (토큰, 비밀번호 등)\
(실무에서는 accessToken, refreshToken 등을 SecureStore에 저장할 수 있음.)

### @react-navigation/material-top-tabs

스와이프 되는 탭 네비게이션

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
