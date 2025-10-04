"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureOAuthProviders = configureOAuthProviders;
exports.tnsOauthLogin = tnsOauthLogin;
exports.tnsRefreshOAuthAccessToken = tnsRefreshOAuthAccessToken;
exports.tnsOauthLogout = tnsOauthLogout;
const nativescript_oauth2_1 = require("nativescript-oauth2");
const providers_1 = require("nativescript-oauth2/providers");
let client = null;
function configureOAuthProviders() {
    const microsoftProvider = configureOAuthProviderMicrosoft();
    const googleProvider = configureOAuthProviderGoogle();
    const facebookProvider = configureOAuthProviderFacebook();
    (0, nativescript_oauth2_1.configureTnsOAuth)([microsoftProvider, googleProvider, facebookProvider]);
}
function configureOAuthProviderGoogle() {
    const googleProviderOptions = {
        openIdSupport: "oid-full",
        clientId: "932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb.apps.googleusercontent.com",
        redirectUri: "com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb:/auth",
        urlScheme: "com.googleusercontent.apps.932931520457-buv2dnhgo7jjjjv5fckqltn367psbrlb",
        scopes: ["email"]
    };
    const googleProvider = new providers_1.TnsOaProviderGoogle(googleProviderOptions);
    return googleProvider;
}
function configureOAuthProviderFacebook() {
    const facebookProviderOptions = {
        openIdSupport: "oid-none",
        clientId: "691208554415645",
        clientSecret: "d8725ac416fa1bb1917ccffd1670e3c6",
        redirectUri: "https://www.facebook.com/connect/login_success.html",
        scopes: ["email"]
    };
    const facebookProvider = new providers_1.TnsOaProviderFacebook(facebookProviderOptions);
    return facebookProvider;
}
function configureOAuthProviderMicrosoft() {
    const microsoftProviderOptions = {
        openIdSupport: "oid-full",
        clientId: "f376fa87-64a9-49a1-8b56-e0d48fc0810b",
        // redirectUri: "urn:ietf:wg:oauth:2.0:oob",
        redirectUri: "msalf376fa87-64a9-49a1-8b56-e0d48fc0810b://auth",
        urlScheme: "msalf376fa87-64a9-49a1-8b56-e0d48fc0810b",
        scopes: ["https://outlook.office.com/mail.read"]
    };
    const microsoftProvider = new providers_1.TnsOaProviderMicrosoft(microsoftProviderOptions);
    return microsoftProvider;
}
function tnsOauthLogin(providerType) {
    // PKCE is enabled by default, but you can pass in 'false' here if you'd like to disable it
    client = new nativescript_oauth2_1.TnsOAuthClient(providerType, true);
    client.loginWithCompletion((tokenResult, error) => {
        if (error) {
            console.error("back to main page with error: ");
            console.error(error);
        }
        else {
            console.log("back to main page with access token: ");
            console.log(tokenResult);
        }
    });
}
function tnsRefreshOAuthAccessToken() {
    if (!client) {
        return;
    }
    client.refreshTokenWithCompletion((tokenResult, error) => {
        if (error) {
            console.error("back to main page with error: ");
            console.error(error);
        }
        else {
            console.log("back to main page with token: ");
            console.log(tokenResult);
        }
    });
}
function tnsOauthLogout() {
    if (client) {
        client.logout();
    }
}
