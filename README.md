# دفترة كاشير — Android build

- The original web application source is preserved under `www/` from the supplied archive's `assets/public/` directory.
- Capacitor 7 wraps the existing web application for Android.
- The existing scanner code already calls `BarcodeScanner.requestPermissions()`; the workflow also declares `android.permission.CAMERA` in the Android manifest.
- GitHub Actions builds a debug APK and publishes it as the `Daftara-Cashier-APK` artifact.

## Build

Push this project to the `main` branch, then open **Actions → Build Daftara APK**. Download the APK from the workflow run's Artifacts section.
