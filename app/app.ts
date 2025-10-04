import { Application, getRootLayout, RootLayout, StackLayout, View } from '@nativescript/core'
import { AppViewModel } from './app-viewmodel'
import { configureOAuthProviders } from "./common/auth-service";

configureOAuthProviders();

export const appViewModel = new AppViewModel()

Application.run({ moduleName: 'app-root' })

