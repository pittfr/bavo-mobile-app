<div align="center">
  <img src="./assets/images/BaVo-logo.png" alt="BaVo Logo" width="120" />

  # BaVo Mobile App

  *Smart access, simplified.*

  [![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)
</div>

## 📖 Overview
BaVo is a modern, cross-platform mobile application built with **React Native** and **Expo** to manage smart locks. It provides users with a seamless, intuitive, and secure experience for access control. The application features a robust authentication flow, highly secure local token storage, and dynamic custom theming.

## ✨ Features
- **Comprehensive Authentication Flow:** Login, Registration, 6-digit OTP Verification, and Password Reset steps.
- **Secure Storage:** Session tokens are securely encrypted and stored locally using `expo-secure-store`.
- **State Management:** Fast, scalable, and centralized state management powered by `Zustand`.
- **Custom Theming:** Responsive styling and automatic Dark/Light mode support using `react-native-unistyles`.
- **File-based Routing:** Clean, strictly typed, and intuitive navigation using `expo-router`.
- **OutSystems Integration:** Pre-configured API service layer pointing to an OutSystems backend.

## 🛠️ Tech Stack
- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** [React Native Unistyles](https://reactnativeunistyles.vercel.app/)
- **Typography:** [Inter Font](https://fonts.google.com/specimen/Inter)
- **Icons:** [Lucide React Native](https://lucide.dev/icons/)

## 📂 Project Structure
```text
bavo-mobile-app/
├── app/                  # Expo Router file-based navigation
│   ├── (auth)/           # Authentication screens (Login, Register, OTP, Reset)
│   ├── (tabs)/           # Authenticated main app tabs
│   └── _layout.tsx       # Root layout & auth guard
├── assets/               # Static assets (images, icons, splash screens)
├── components/           # Reusable UI components (Buttons, Inputs, Layouts)
├── services/             # API configuration and network requests (authService.ts)
├── store/                # Zustand global state stores (authStore.ts)
├── unistyles.ts          # Global theme and styling configuration
└── app.json              # Expo application configuration
