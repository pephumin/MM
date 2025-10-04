"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goTo = goTo;
exports.validateEmail = validateEmail;
exports.SentenceCase = SentenceCase;
exports.LowerCase = LowerCase;
const core_1 = require("@nativescript/core");
function goTo(page) {
    core_1.Frame.topmost().navigate(page);
}
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
function SentenceCase(str) {
    if (!str) {
        return '';
    }
    else {
        return str.toLowerCase().replace(/(^\s*\w|\.\s*\w)/g, (c) => c.toUpperCase());
    }
}
function LowerCase(str) {
    if (!str) {
        return '';
    }
    else {
        return str.toLowerCase();
    }
}
