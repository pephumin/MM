import { Application, isAndroid, isIOS, getRootLayout, RootLayout, View } from '@nativescript/core';
import Theme from '@nativescript/theme';
import { AppViewModelInstance } from '~/common/instance';
import { configureOAuthProviders } from "./common/auth-service";

Theme.setMode(Theme.Light);
Application.setCssFileName('themes/light.css');
// Application.on(Application.systemAppearanceChangedEvent, (event) => {
//   const appearance = (event as any).newValue as SystemAppearance;
//   Theme.setMode(appearance === 'dark' ? Theme.Dark : Theme.Light);
// });

configureOAuthProviders();

export const appViewModel = AppViewModelInstance;

Application.run({ moduleName: 'app-root' });

