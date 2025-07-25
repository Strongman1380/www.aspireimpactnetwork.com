import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recoveryconnect.app',
  appName: 'Recovery Connect',
  webDir: 'src',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#f8fafc",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#06b6d4",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#06b6d4'
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#06b6d4",
      sound: "beep.wav"
    },
    Haptics: {},
    App: {
      deepLinkingEnabled: true
    },
    Device: {},
    Network: {},
    Share: {},
    Toast: {},
    Dialog: {},
    Filesystem: {},
    Geolocation: {
      permissions: {
        location: "when-in-use"
      }
    }
  },
  ios: {
    scheme: "Recovery Connect",
    contentInset: "automatic"
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: "APK",
      signingType: "apksigner"
    }
  }
};

export default config;