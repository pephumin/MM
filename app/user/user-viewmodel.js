"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserViewModel = void 0;
const core_1 = require("@nativescript/core");
const facebook_1 = require("@nativescript/facebook");
// import { GoogleSignin } from '@nativescript/google-signin';
const util_1 = require("~/common/util");
class UserViewModel extends core_1.Observable {
    constructor() {
        super();
        this._email = "";
        this._password = "";
        this._repassword = "";
        this._isLoading = false;
        this._feedbackMessage = "";
        this._label1Visibility = 'collapse';
        this._label2Visibility = 'collapse';
        this._label3Visibility = 'collapse';
    }
    goToRegistration() { core_1.Frame.topmost().navigate("~/user/registration"); }
    goToForgotPassword() { core_1.Frame.topmost().navigate("~/user/forgot-password"); }
    goToLogin() { core_1.Frame.topmost().navigate("~/user/login"); }
    goToHome() { core_1.Frame.topmost().navigate("~/home/home"); }
    get email() { return (0, util_1.LowerCase)(this._email); }
    // get email(): string { return this._email.toLowerCase(); }
    // set email(value: string) { if (this._email !== value) { this._email = value; this.notifyPropertyChange("email", value); this.label1Visibility = "visible"; } else { this.label1Visibility = "collapse";}}
    // set email(value: string) { 
    //   if (this._email !== value) { 
    //     const newValue = value.toLowerCase();
    //     this._email = newValue;
    //     this.set("email", newValue);
    //   }
    // }
    set email(value) {
        const raw = (value ?? "").toString();
        const trimmed = raw.trim();
        const lower = (0, util_1.LowerCase)(trimmed);
        console.log(`Email setter called — raw: "${raw}", lower: "${lower}"`);
        if (this._email !== lower) {
            this._email = lower;
        }
        if (lower.length === 0) {
            this.feedbackMessage = "";
        }
        else if (!(0, util_1.validateEmail)(lower)) {
            this.feedbackMessage = "Invalid email format";
            this.label1Visibility = "collapse";
        }
        else {
            this.feedbackMessage = "";
            this.label1Visibility = "visible";
        }
    }
    get password() { return this._password; }
    set password(value) {
        if (this._password !== value) {
            this._password = value;
            this.label2Visibility = "visible";
        }
        else {
            this.label2Visibility = "collapse";
        }
        if (this.password === this.repassword) {
            this.label3Visibility = "visible";
        }
        else {
            this.label3Visibility = "collapse";
        }
    }
    get repassword() { return this._repassword; }
    set repassword(value) {
        if (this._repassword !== value) {
            this._repassword = value;
        }
        if (this.password === this.repassword) {
            this.label3Visibility = "visible";
        }
        else {
            this.label3Visibility = "collapse";
        }
    }
    get isLoading() { return this._isLoading; }
    set isLoading(value) { if (this._isLoading !== value) {
        this._isLoading = value;
        this.notifyPropertyChange("isLoading", value);
    } }
    get feedbackMessage() { if (this._feedbackMessage) {
        return (0, util_1.SentenceCase)(this._feedbackMessage);
    } }
    set feedbackMessage(value) { if (this._feedbackMessage !== value) {
        this._feedbackMessage = value;
        this.notifyPropertyChange("feedbackMessage", value);
    } }
    get label1Visibility() { return this._label1Visibility; }
    set label1Visibility(value) { if (this._label1Visibility !== value) {
        this._label1Visibility = value;
        this.notifyPropertyChange("label1Visibility", value);
    } }
    get label2Visibility() { return this._label2Visibility; }
    set label2Visibility(value) { if (this._label2Visibility !== value) {
        this._label2Visibility = value;
        this.notifyPropertyChange("label2Visibility", value);
    } }
    get label3Visibility() { return this._label3Visibility; }
    set label3Visibility(value) { if (this._label3Visibility !== value) {
        this._label3Visibility = value;
        this.notifyPropertyChange("label3Visibility", value);
    } }
    async login() {
        if (!this.email) {
            if (!this.password) {
                this.feedbackMessage = "Please enter email and password to login.";
                return;
            }
            else {
                this.feedbackMessage = "Please enter your email to login.";
                return;
            }
        }
        else {
            if (!this.password) {
                this.feedbackMessage = "Please enter your password to login.";
                return;
            }
        }
        this.isLoading = true;
        try {
            console.log("Logging in with:", this.email, this.password);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const login = this.email.toLowerCase();
            if (login === "taken@example.com") {
                this.feedbackMessage = "This email is already registered, reset your password and try again.";
                const options = {
                    title: "System Alert",
                    message: this.feedbackMessage,
                    // okButtonText: "OK!",
                    cancelable: false
                };
                core_1.Dialogs.alert(options).then(() => {
                    console.log("Custom alert dialog closed.");
                });
            }
            else {
                this.feedbackMessage = "Login has been successful.";
            }
        }
        catch (err) {
            this.feedbackMessage = "Login failed: " + err;
        }
        finally {
            this.isLoading = false;
        }
    }
    async register() {
        if (!this.email) {
            if (!this.password && !this.repassword) {
                this.feedbackMessage = "Please enter all required fields.";
                return;
            }
            else {
                this.feedbackMessage = "Please enter your email to register.";
                return;
            }
        }
        else {
            if (!this.password && !this.repassword) {
                this.feedbackMessage = "Please enter password twice to register.";
                return;
            }
        }
        if (this.password !== this.repassword) {
            this.feedbackMessage = "Your passwords do not match, please try again.";
            return;
        }
        this.isLoading = true;
        try {
            console.log("Registering user:", this.email);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            if (this.email === "test@example.com") {
                this.feedbackMessage = "This email is already registered, try logging in.";
            }
            else {
                this.feedbackMessage = "Registration is successful.";
            }
        }
        catch (err) {
            this.feedbackMessage = "Registration failed: " + err;
        }
        finally {
            this.isLoading = false;
        }
    }
    async forgotPassword() {
        if (!this.email) {
            this.feedbackMessage = "Please enter your email to reset password.";
            return;
        }
        this.isLoading = true;
        try {
            console.log("Requesting password reset for:", this.email);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            this.feedbackMessage = "A password reset link has been sent to you, please check your email.";
        }
        catch (err) {
            this.feedbackMessage = "Failed to send a password reset link: " + err;
        }
        finally {
            this.isLoading = false;
        }
    }
    async loginWithFacebook() {
        this.isLoading = true;
        try {
            const result = await facebook_1.LoginManager.logInWithPermissions(["public_profile", "email"]);
            if (result && result.declinedPermissions.length === 0) {
                const token = await facebook_1.AccessToken.currentAccessToken();
                if (token) {
                    // const token = tokenData.accessToken;
                    const res = await fetch("http://siamsquare.org.uk/api.php?action=facebook", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token })
                    });
                    const data = await res.json();
                    this.feedbackMessage = data.message;
                }
                else {
                    this.feedbackMessage = "Failed to retrieve Facebook access token";
                }
            }
            else {
                this.feedbackMessage = "Facebook login cancelled";
            }
        }
        catch (err) {
            this.feedbackMessage = "Facebook login failed: " + err;
        }
        finally {
            this.isLoading = false;
        }
    }
}
exports.UserViewModel = UserViewModel;
