"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserViewModel = void 0;
const api_1 = require("../common/api");
const observable_1 = require("@nativescript/core/data/observable");
class UserViewModel extends observable_1.Observable {
    constructor(info = {}) {
        super();
        this.set("email", info.email || "");
        this.set("password", info.password || "");
    }
    register() {
        return fetch(`${api_1.config.apiUrl}user/${api_1.config.appKey}`, {
            method: "POST",
            body: JSON.stringify({
                username: this.get("email"),
                email: this.get("email"),
                password: this.get("password")
            }),
            headers: this.getCommonHeaders()
        }).then(this.handleErrors);
    }
    getCommonHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": api_1.config.appUserHeader
        };
    }
    handleErrors(response) {
        if (!response.ok) {
            console.log(JSON.stringify(response));
            throw new Error(response.statusText);
        }
        return response;
    }
}
exports.UserViewModel = UserViewModel;
