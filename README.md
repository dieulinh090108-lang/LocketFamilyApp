# LocketFamily - Ứng dụng Gia đình Thông minh

<div align="center">
  <h3>Kết nối gia đình qua từng khoảnh khắc</h3>
  <p><em>Đặc biệt thiết kế cho người lớn tuổi có bệnh Alzheimer</em></p>
</div>

## 🎯 Mục đích

**LocketFamily** là ứng dụng gia đình được thiết kế đặc biệt để hỗ trợ người lớn tuổi, đặc biệt là những người mắc bệnh Alzheimer, nhớ lại tên các thành viên gia đình thông qua hình ảnh và công nghệ nhận diện khuôn mặt.

### Vấn đề giải quyết
- 👴 **Người lớn tuổi** thường quên tên các thành viên gia đình do bệnh Alzheimer
- 📱 **Giao diện phức tạp** của các ứng dụng hiện tại không phù hợp với người cao tuổi
- 🔊 **Khó khăn đọc chữ** - cần hỗ trợ âm thanh để nhận diện

### Giải pháp
- 👁️ **Nhận diện khuôn mặt tự động** trên mọi bức ảnh gia đình
- 🎯 **Nhấn để nghe tên** - chỉ cần chạm vào khuôn mặt để nghe tên người thân
- 🗣️ **Text-to-Speech tiếng Việt** với giọng đọc tự nhiên
- 📱 **Giao diện đơn giản** với chữ to, màu sắc dễ nhìn

## ✨ Tính năng chính

### 📸 Timeline Gia đình
- Hiển thị các bài đăng của thành viên gia đình
- Chỉ báo số lượng khuôn mặt được phát hiện
- Giao diện giống Facebook nhưng đơn giản hóa
- **Scroll mượt mà** với FlatList được tối ưu

### 🎯 Nhận diện Khuôn mặt Tương tác
- Tự động phát hiện và đánh dấu khuôn mặt trên ảnh
- **Face boxes lớn (150-250px)** dễ chạm cho người cao tuổi
- Hiển thị tên từng người bằng nhãn màu xanh
- Chạm vào khuôn mặt để nghe tên bằng tiếng Việt
- **Coordinate mapping chính xác** với mọi tỷ lệ ảnh

### 🔊 Text-to-Speech (TTS)
- Hỗ trợ tiếng Việt chuẩn (`vi-VN`)
- Phát âm rõ ràng, phù hợp người cao tuổi
- Tự động dừng âm thanh cũ khi phát âm mới
- **Response nhanh** nhờ useCallback optimization

### 🎨 Giao diện Thân thiện
- Màu sắc ấm áp, dễ nhìn
- Font chữ lớn, độ tương phản cao
- **Touch targets lớn (minimum 150px)** cho người cao tuổi
- **Performance cao** với React.memo và useMemo

### ⚡ Performance Optimizations
- **React.memo** - Giảm 60-80% re-renders không cần thiết
- **useMemo** - Memoize coordinate calculations phức tạp
- **useCallback** - Optimize event handlers và TTS functions
- **FlatList optimization** - Smooth scrolling trên thiết bị cũ

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
# LocketFamilyApp
