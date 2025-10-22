# Hướng dẫn Cài đặt và Chạy LocketFamily

## Yêu cầu Hệ thống

### Phần mềm cần thiết

- **Node.js**: 18.0+ (khuyến khích 20.x LTS)
- **npm**: 9.0+ hoặc **Yarn**: 1.22+
- **React Native CLI**: 12.0+
- **Git**: Phiên bản mới nhất

### Cho phát triển Android

- **Android Studio**: Arctic Fox hoặc mới hơn
- **Android SDK**: API Level 33+ (Android 13)
- **Java Development Kit**: JDK 17
- **Android Virtual Device** (AVD) hoặc thiết bị Android thật

### Cho phát triển iOS (chỉ trên macOS)

- **Xcode**: 14.0+
- **iOS SDK**: 16.0+
- **CocoaPods**: 1.11+
- **iOS Simulator** hoặc thiết bị iOS thật

## Cài đặt Môi trường

### 1. Cài đặt Node.js

```bash
# Cách 1: Tải từ trang chính thức
# https://nodejs.org/

# Cách 2: Sử dụng nvm (khuyến khích)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 2. Cài đặt React Native CLI

```bash
npm install -g @react-native-community/cli
```

### 3. Thiết lập Android Development

#### Cài đặt Android Studio
1. Tải Android Studio từ https://developer.android.com/studio
2. Cài đặt với cấu hình mặc định
3. Mở Android Studio và cài đặt Android SDK

#### Cấu hình Environment Variables (Windows)

```bash
# Thêm vào System Environment Variables
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\%USERNAME%\AppData\Local\Android\Sdk

# Thêm vào PATH
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

#### Cấu hình Environment Variables (macOS/Linux)

```bash
# Thêm vào ~/.bashrc, ~/.zshrc, hoặc ~/.profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 4. Thiết lập iOS Development (chỉ macOS)

#### Cài đặt Xcode
```bash
# Cài đặt từ App Store hoặc
xcode-select --install
```

#### Cài đặt CocoaPods
```bash
sudo gem install cocoapods
```

## Clone và Cài đặt Dự án

### 1. Clone Repository

```bash
git clone https://github.com/yourname/LocketFamily.git
cd LocketFamily
```

### 2. Cài đặt Dependencies

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng Yarn
yarn install
```

### 3. Cài đặt iOS Dependencies (chỉ macOS)

```bash
cd ios
pod install
cd ..
```

## Chạy Ứng dụng

### 1. Khởi động Metro Server

```bash
# Terminal 1: Khởi động Metro bundler
npm start
# hoặc
yarn start
```

### 2. Chạy trên Android

```bash
# Terminal 2: Build và chạy Android
npm run android
# hoặc
yarn android
```

**Lưu ý**: Đảm bảo Android emulator đang chạy hoặc thiết bị Android đã kết nối với USB debugging enabled.

### 3. Chạy trên iOS (chỉ macOS)

```bash
# Terminal 2: Build và chạy iOS
npm run ios
# hoặc
yarn ios
```

## Kiểm tra Thiết lập

### Verify React Native Setup

```bash
npx react-native doctor
```

Lệnh này sẽ kiểm tra:
- Node.js version
- Android SDK setup
- iOS development setup (macOS)
- Environment variables

### Test TTS Functionality

```bash
# Chạy test để kiểm tra Text-to-Speech
npm test -- --testNamePattern="TTS"
```

## Cấu hình cho Development

### 1. Enable Debugging

#### Android Debug Bridge (ADB)
```bash
# Kiểm tra thiết bị kết nối
adb devices

# Forward port cho debugging
adb reverse tcp:8081 tcp:8081
```

#### iOS Simulator Debug Menu
- Phím tắt: `Cmd + D` trong simulator
- Hoặc `Device → Shake` trong menu

### 2. Configure TTS cho các ngôn ngữ

```typescript
// android/app/src/main/AndroidManifest.xml
<queries>
  <intent>
    <action android:name="android.intent.action.TTS_SERVICE" />
  </intent>
</queries>
```

### 3. Permission Setup

#### Android Permissions
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

#### iOS Permissions
```xml
<!-- ios/LocketFamily/Info.plist -->
<key>NSCameraUsageDescription</key>
<string>Ứng dụng cần quyền camera để chụp ảnh gia đình</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Ứng dụng cần quyền truy cập thư viện ảnh</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Ứng dụng cần quyền đọc tên người thân</string>
```

## Build Production

### Android Release Build

```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# APK sẽ được tạo tại:
# android/app/build/outputs/apk/release/app-release.apk
```

### iOS Release Build

```bash
# Build for App Store
cd ios
xcodebuild -workspace LocketFamily.xcworkspace \
           -scheme LocketFamily \
           -configuration Release \
           -archivePath build/LocketFamily.xcarchive \
           archive
```

## Performance Testing

### Test Performance Optimizations

```bash
# Chạy app trong Release mode cho performance testing
npm run android -- --mode=Release
# hoặc
yarn android --mode=Release

# iOS Release mode
npm run ios -- --mode=Release
```

### Performance Benchmarks

**Test các tính năng sau:**

1. **Timeline Scrolling Performance**
   - Scroll qua 6+ posts với images
   - Kiểm tra smooth scrolling không lag
   - Memory usage stable

2. **Face Detection Response Time**
   - Tap vào face boxes (150-250px size)
   - TTS response < 200ms
   - Modal open/close smooth

3. **Memory Usage**
   - Monitor memory trong 5 phút sử dụng
   - Không có memory leaks
   - Stable performance trên thiết bị cũ

### Performance Monitoring Tools

```bash
# Enable performance monitoring
npm install react-native-flipper
# Flipper sẽ show React DevTools, Network, và Performance

# Android performance profiling
adb shell dumpsys gfxinfo com.locketfamily
```

## Troubleshooting

### Common Issues

#### 1. Metro bundler không khởi động được

```bash
# Reset Metro cache
npx react-native start --reset-cache

# Hoặc xóa node_modules và reinstall
rm -rf node_modules
npm install
```

#### 2. Android build fails với Gradle error

```bash
# Clean Gradle cache
cd android
./gradlew clean

# Hoặc reset toàn bộ
cd ..
rm -rf node_modules
npm install
cd android
./gradlew clean
cd ..
npm run android
```

#### 3. iOS pods installation fails

```bash
cd ios
pod deintegrate
pod setup
pod install
cd ..
```

#### 4. TTS không hoạt động trên emulator

- TTS chỉ hoạt động tốt trên thiết bị thật
- Cần cài đặt Vietnamese TTS engine trên Android
- iOS simulator có thể không hỗ trợ đầy đủ TTS

#### 5. App lag hoặc performance issues

```bash
# Enable production optimizations trong development
# android/app/build.gradle
android {
  buildTypes {
    debug {
      minifyEnabled true
      useProguard true
    }
  }
}

# Enable Hermes engine
project.ext.react = [
    enableHermes: true
]
```

### Performance Issues

#### 1. Slow development builds
```bash
# Enable Hermes engine (nếu chưa enable)
# android/app/build.gradle
project.ext.react = [
    enableHermes: true
]
```

#### 2. Large bundle size
```bash
# Analyze bundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle

# Enable ProGuard for release builds
# android/app/build.gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

## Development Workflow

### 1. Code Style và Linting

```bash
# Install ESLint và Prettier
npm install --save-dev eslint prettier

# Run linting
npm run lint

# Auto-fix issues
npm run lint:fix
```

### 2. Testing

```bash
# Run unit tests
npm test

# Run tests với coverage
npm test -- --coverage

# Run specific test file
npm test ImageDetailModal.test.tsx
```

### 3. Debugging Tools

#### Flipper Integration
```bash
# Install Flipper desktop app
# https://fbflipper.com/

# Enable in development builds automatically
```

#### Remote Debugging
```bash
# Chrome DevTools
# Shake device → "Debug JS Remotely"
# Mở Chrome → chrome://inspect
```

## Deployment

### 1. Android Play Store

```bash
# Generate signed bundle
cd android
./gradlew bundleRelease

# Upload android/app/build/outputs/bundle/release/app-release.aab
```

### 2. iOS App Store

```bash
# Archive và upload qua Xcode
# hoặc sử dụng command line tools
xcodebuild -exportArchive \
    -archivePath build/LocketFamily.xcarchive \
    -exportOptionsPlist exportOptions.plist \
    -exportPath build/
```

## Monitoring và Analytics

### 1. Crash Reporting

```bash
# Install Sentry for React Native
npm install @sentry/react-native

# Configure theo hướng dẫn:
# https://docs.sentry.io/platforms/react-native/
```

### 2. Performance Monitoring

```bash
# Install Firebase Performance
npm install @react-native-firebase/perf

# Setup theo documentation Firebase
```

## Support

### Resources
- **Documentation**: [React Native Docs](https://reactnative.dev/docs/getting-started)
- **Face Detection API**: Xem `docs/FACE_DETECTION.md`
- **Architecture**: Xem `docs/ARCHITECTURE.md`

### Common Commands Reference

```bash
# Development
npm start                    # Start Metro
npm run android             # Run Android
npm run ios                 # Run iOS
npm test                    # Run tests
npm run lint                # Lint code

# Maintenance
npm run clean               # Clean caches
npx react-native doctor     # Check setup
adb devices                 # List Android devices
xcrun simctl list devices   # List iOS simulators

# Build
npm run build:android       # Build Android APK
npm run build:ios           # Build iOS archive
```

---

Sau khi hoàn thành setup, bạn sẽ có một ứng dụng LocketFamily hoạt động đầy đủ với tính năng face detection và text-to-speech cho người cao tuổi!