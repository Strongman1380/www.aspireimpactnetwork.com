<div align="center">

# FosterLinks (Flutter)

Cross‑platform Flutter implementation of the FosterLinks application (Mobile, Web, Desktop).

</div>

## 1. Overview

This Flutter app provides:

* Email/password authentication via Firebase Auth
* Role‑based user model (admin / worker / foster_parent)
* Firestore data layer (users, youth profiles, medication logs – WIP)
* Theming (light / dark + persistent custom colors)
* Declarative navigation with `go_router`
* Provider‑based state management

## 2. Prerequisites

Install / have available:

* Flutter SDK (stable channel) – https://docs.flutter.dev/get-started/install
* Dart SDK (bundled with Flutter)
* Xcode (for iOS/macOS) / Android Studio (for Android) with required platform toolchains
* A Firebase project (console) with Authentication + Firestore + (optionally) Analytics & Storage enabled

Verify environment (example):

```bash
flutter --version
dart --version
```

## 3. Clone & Dependencies

From the repository root:

```bash
cd foster_links_flutter
flutter pub get
```

If you see a Dart SDK constraint mismatch, update `environment.sdk` in `pubspec.yaml` to match your installed Flutter (e.g. `">=3.3.0 <4.0.0"`).

## 4. Firebase Configuration

The file `lib/firebase_options.dart` currently contains placeholder values. Replace them using the FlutterFire CLI.

### 4.1 Enable FlutterFire CLI (once globally)
```bash
dart pub global activate flutterfire_cli
```

Ensure `~/.pub-cache/bin` is on your PATH (Mac zsh example):
```bash
echo 'export PATH="$PATH:$HOME/.pub-cache/bin"' >> ~/.zshrc && source ~/.zshrc
```

### 4.2 Register Apps in Firebase Console
In the Firebase console add apps for each platform you intend to support:
* iOS (Bundle ID e.g. `com.fosterlinks.app`)
* Android (Application ID e.g. `com.fosterlinks.app` – update `android/app/build.gradle.kts` accordingly)
* Web (optional – enables PWA / browser support)
* macOS / Windows (optional)

Download each platform file when prompted:
* Android: `google-services.json` → place into `android/app/`
* iOS: `GoogleService-Info.plist` → place into `ios/Runner/`
* macOS (if enabled): `GoogleService-Info.plist` → `macos/Runner/`

### 4.3 Generate `firebase_options.dart`
From the `foster_links_flutter` directory run:
```bash
flutterfire configure
```
Select your Firebase project and desired platforms. This will overwrite `lib/firebase_options.dart` with real values.

### 4.4 Android Gradle Plugin Integration
Add the Google services Gradle plugin if not already:

In `android/settings.gradle` or via `plugins` block (newer Gradle) ensure the plugin portal is accessible. Then in `android/app/build.gradle.kts` add:
```kotlin
plugins {
		id("com.google.gms.google-services")
}
```

If you use the older buildscript approach, add to the root `build.gradle` inside `dependencies {}`:
```kotlin
classpath("com.google.gms:google-services:4.4.2")
```

### 4.5 (Optional) Analytics / Crashlytics
Add packages (already `firebase_analytics` present). For Crashlytics add to `pubspec.yaml`: `firebase_crashlytics` and run `flutter pub add firebase_crashlytics`. Then initialize as needed.

## 5. Running the App

### Mobile (Android)
```bash
flutter run -d android
```

### Mobile (iOS simulator)
```bash
flutter run -d ios
```
(First run may require `cd ios && pod install` if CocoaPods updates are needed.)

### Web
```bash
flutter run -d chrome
```

### macOS (if enabled)
```bash
flutter run -d macos
```

## 6. Project Structure (Key Folders)

```
lib/
	main.dart               # Entry, Firebase init, providers
	firebase_options.dart   # Generated config (DO NOT hardcode secrets in repo)
	providers/              # Auth, Theme, UI state
	services/               # AuthService, FirestoreService abstractions
	screens/                # Feature UI screens
	widgets/                # Reusable components
	models/                 # Data models
	theme/                  # Theme definitions
	utils/app_router.dart   # go_router config
assets/
	images/, icons/         # Declared in pubspec
test/                     # Unit & widget tests (expand)
```

## 7. Theming & Custom Colors
`ThemeProvider` persists theme mode & custom colors using `SharedPreferences`. Access custom colors with:
```dart
final customPrimary = context.watch<ThemeProvider>().getCustomColor('primaryAccent');
```
Persist a new custom color:
```dart
context.read<ThemeProvider>().setCustomColor('primaryAccent', Colors.teal);
```

## 8. Authentication Flow
1. `AuthProvider` listens to `FirebaseAuth.instance.authStateChanges()`
2. On sign‑in it loads user role + profile from Firestore
3. `go_router` redirect logic enforces navigation protection

Default roles supported: `admin`, `worker`, `foster_parent`.

## 9. Firestore Data Model (Current / Planned)
Collection examples (adjust to your security rules):
```
users/{uid}:
	email, role, firstName, lastName, createdAt, updatedAt

youth/{youthId}:
	firstName, lastName, dob, assignedWorkerId, fosterParentIds[], medications[]

medicationLogs/{logId}:
	youthId, medicationName, dosage, administeredAt, administeredBy, notes
```

## 10. Security Rules
Refer to root `firestore.rules`. Ensure you implement role checks before production. Test rules using the Firebase Emulator Suite:
```bash
firebase emulators:start --only firestore,auth
```

## 11. Testing
Basic example test added for `ThemeProvider` persistence. Run:
```bash
flutter test
```
Add widget tests (e.g. login form validation) and service tests (mock Firestore) for broader coverage.

## 12. Environment / Secrets Hygiene
Do NOT commit:
* Real API keys inside docs (they appear in config but treat them as public client keys)
* Service account keys
* Private test data

Consider adding a separate `.env` solution (e.g. `flutter_dotenv`) for non‑Firebase secrets if needed.

## 13. Building Release Artifacts

### Android (APK / App Bundle)
```bash
flutter build appbundle -t lib/main.dart --release
```
Configure signing in `android/app/build.gradle.kts` with a release keystore (remove debug signingConfig).

### iOS
```bash
flutter build ipa --release
```
Open Xcode for distribution steps.

### Web (PWA)
```bash
flutter build web --release
```
Deploy contents of `build/web/` to hosting (Firebase Hosting, etc.).

## 14. Next Steps / Suggested Improvements
* Add proper error surfaces for Firestore failures
* Introduce repository layer + DTO mapping for clearer separation
* Add Crashlytics & Analytics event logging
* Implement offline caching (e.g. `hive` or `sembast` for local store)
* Role‑based navigation guard refinements (e.g. admin‑only routes)
* Introduce integration tests with the Firebase Emulator
* CI workflow (GitHub Actions) to run `flutter analyze` + `flutter test`

## 15. Troubleshooting
| Issue | Tip |
|-------|-----|
| iOS build fails (codesign) | Run `xcode-select --install` & accept licenses. |
| Android multidex errors | Increase minSdk or enable multidex (if adding many deps). |
| Firebase Auth not working on web | Confirm auth domain added in Firebase console. |
| Cannot find google-services plugin | Add the classpath / plugin as per section 4.4. |
| Theme not persisting | Verify `SharedPreferences` initialization on target platform. |

---
Happy building! 🎉

