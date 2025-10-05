import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'org.nativescript.MM',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
  ios: {
    SPMPackages: [
      {
        name: 'SharedWidget',
        libs: ['SharedWidget'],
        path: './Shared_Resources/iOS/SharedWidget',
        targets: ['phumin'],
      },
    ],
  },
} as NativeScriptConfig
