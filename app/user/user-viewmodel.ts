import { DialogOptions, Dialogs, Frame, Observable } from "@nativescript/core";
import { LoginManager, AccessToken } from '@nativescript/facebook';
// import { GoogleSignin } from '@nativescript/google-signin';
import { LowerCase, SentenceCase, validateEmail } from "~/common/util";

export class UserViewModel extends Observable {
  private _email: string = "";
  private _password: string = "";
  private _repassword: string = "";
  private _label1Visibility: string = 'collapse';
  private _label2Visibility: string = 'collapse';
  private _label3Visibility: string = 'collapse';
  private _isLoading: boolean = false;
  private _feedbackMessage: string = "";

  constructor() {
    super();
    this.set('goToRegistration', this.goToRegistration);
    this.set('goToForgotPassword', this.goToForgotPassword);
    this.set('goToLogin', this.goToLogin);
    this.set('goToHome', this.goToHome);
  }

  public goToRegistration() { Frame.topmost().navigate("~/user/registration"); }
  public goToForgotPassword() { Frame.topmost().navigate("~/user/forgot-password"); }
  public goToLogin() { Frame.topmost().navigate("~/user/login"); }
  public goToHome() { Frame.topmost().navigate("~/home/home"); }

  get email(): string { return LowerCase(this._email); }
  set email(value: string) {
    const raw = (value ?? "").toString();
    const trimmed = raw.trim();
    const lower = LowerCase(trimmed);
    console.log(`Email setter called — raw: "${raw}", lower: "${lower}"`);
    if (this._email !== lower) { this._email = lower; }
    if (lower.length === 0) { this.feedbackMessage = ""; } 
    else if (!validateEmail(lower)) { this.feedbackMessage = "Invalid email format"; this.label1Visibility = "collapse"; } 
    else { this.feedbackMessage = ""; this.label1Visibility = "visible";  }
  }
  get password(): string { return this._password; }
  set password(value: string) { 
    if (this._password !== value) { this._password = value; this.label2Visibility = "visible"; }
    else { this.label2Visibility = "collapse";}
    if (this.password === this.repassword) { this.label3Visibility = "visible"; } else { this.label3Visibility = "collapse"; }
  }
  get repassword(): string { return this._repassword; }
  set repassword(value: string) { 
    if (this._repassword !== value) { this._repassword = value; }
    if (this.password === this.repassword) { this.label3Visibility = "visible"; } else { this.label3Visibility = "collapse"; }
  }
  get isLoading(): boolean { return this._isLoading; }
  set isLoading(value: boolean) { if (this._isLoading !== value) { this._isLoading = value; this.notifyPropertyChange("isLoading", value); } }
  get feedbackMessage(): string { if (this._feedbackMessage) { return SentenceCase(this._feedbackMessage); } }
  set feedbackMessage(value: string) { if (this._feedbackMessage !== value) { this._feedbackMessage = value; this.notifyPropertyChange("feedbackMessage", value); } }
  get label1Visibility(): string { return this._label1Visibility; }
  set label1Visibility(value: string) { if (this._label1Visibility !== value) { this._label1Visibility = value; this.notifyPropertyChange("label1Visibility", value); } }
  get label2Visibility(): string { return this._label2Visibility; }
  set label2Visibility(value: string) { if (this._label2Visibility !== value) { this._label2Visibility = value; this.notifyPropertyChange("label2Visibility", value); } }
  get label3Visibility(): string { return this._label3Visibility; }
  set label3Visibility(value: string) { if (this._label3Visibility !== value) { this._label3Visibility = value; this.notifyPropertyChange("label3Visibility", value); } }
  
  async login() {
    if (!this.email) { 
      if (!this.password) { this.feedbackMessage = "Please enter email and password to login."; return; }
      else { this.feedbackMessage = "Please enter your email to login."; return; }
    } else {
      if (!this.password) { this.feedbackMessage = "Please enter your password to login."; return; }
    }
    this.isLoading = true;
    try {
      console.log("Logging in with:", this.email, this.password);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const login = this.email.toLowerCase();
      if (login === "taken@example.com") { 
        this.feedbackMessage = "This email is already registered, reset your password and try again.";
        const options: DialogOptions = {
          title: "System Alert",
          message: this.feedbackMessage,
          // okButtonText: "OK!",
          cancelable: false
        };
        Dialogs.alert(options).then(() => {
          console.log("Custom alert dialog closed.");
        });
      } 
      else { this.feedbackMessage = "Login has been successful."; }
    } 
    catch (err) { this.feedbackMessage = "Login failed: " + err; }
    finally { this.isLoading = false; }
  }

  async register() {
    if (!this.email) { 
      if (!this.password && !this.repassword) { this.feedbackMessage = "Please enter all required fields."; return; }
      else { this.feedbackMessage = "Please enter your email to register."; return; }
    } else {
      if (!this.password && !this.repassword) { this.feedbackMessage = "Please enter password twice to register."; return; }
    }
    if (this.password !== this.repassword) { this.feedbackMessage = "Your passwords do not match, please try again."; return; }
    this.isLoading = true;
    try {
      console.log("Registering user:", this.email);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (this.email === "test@example.com") { this.feedbackMessage = "This email is already registered, try logging in."; } 
      else { this.feedbackMessage = "Registration is successful."; }
    } 
    catch (err) { this.feedbackMessage = "Registration failed: " + err; }
    finally { this.isLoading = false; }
  }

  async forgotPassword() {
    if (!this.email) { this.feedbackMessage = "Please enter your email to reset password."; return; }
    this.isLoading = true;
    try {
      console.log("Requesting password reset for:", this.email);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.feedbackMessage = "A password reset link has been sent to you, please check your email.";
    } 
    catch (err) { this.feedbackMessage = "Failed to send a password reset link: " + err; }
    finally { this.isLoading = false; }
  }

  async loginWithFacebook() {
    this.isLoading = true;
    try {
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
      if (result && result.declinedPermissions.length === 0) {
        const token = await AccessToken.currentAccessToken();
        if (token) {
          const res = await fetch("http://siamsquare.org.uk/api.php?action=facebook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
          });
          const data = await res.json();
          this.feedbackMessage = data.message;
        } 
        else { this.feedbackMessage = "Failed to retrieve Facebook access token"; }
      } 
      else { this.feedbackMessage = "Facebook login cancelled"; }
    } 
    catch (err) { this.feedbackMessage = "Facebook login failed: " + err; }
    finally { this.isLoading = false; }
  }

  // async loginWithGoogle() {
  //   this.isLoading = true;
  //   try {
  //     await GoogleSignin.configure({
  //       scopes: ['email', 'profile'],
  //       webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
  //     });
  //     const userInfo = await GoogleSignin.signIn();
  //     const token = userInfo.idToken;
  //     // send token to backend for verification
  //     const res = await fetch("http://siamsquare.org.uk/api.php?action=google", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ token })
  //     });
  //     const data = await res.json();
  //     this.feedbackMessage = data.message;
  //   } 
  //   catch (err) { this.feedbackMessage = "Google login failed: " + err; }
  //   finally { this.isLoading = false; }
  // }

}
