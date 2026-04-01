# 🚀 Production-Ready React Native Expo Boilerplate

A comprehensive, type-safe, and highly opinionated boilerplate for building scalable mobile applications with **Expo**. This starter kit handles the complex "plumbing" of modern apps—Authentication, Dynamic Theming, and Real-time WebSockets—so you can focus on building features.

---

## ✨ Backend

* **Download here:** [backend-nestjs](https://github.com/AliKales/backend-nestjs)

---

## ✨ Key Features

* **🌓 Advanced Theme Engine:** Full support for Light, Dark, and System modes. Themes are persistent across app restarts using `expo-secure-store`.
* **🔐 Robust Auth Flow:** Integrated `AuthContext` with JWT session management and automatic protected route redirection via Expo Router.
* **🔌 Socket.IO Integration:** A global `WebSocketContext` pre-configured for NestJS. Includes manual connection controls and cross-page message listeners.
* **🎬 Smooth Animations:** Optimized entrance animations using **React Native Reanimated** (60FPS).
* **🛠 Custom UI Library:** Atomic components like `CustomButton` and `CustomTextInput` built with `forwardRef` for full focus control.
* **📱 Native Bug Fixes:** Includes built-in workarounds for common platform issues, such as the **iOS Password Kerning Glitch**.

---

## 🛠 Tech Stack

* **Framework:** [Expo](https://expo.dev/) (SDK 50+)
* **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based)
* **State Management:** React Context API
* **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
* **Security:** [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/secure-store/)
* **Real-time:** Socket.IO Client