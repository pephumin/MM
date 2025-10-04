"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNavigatingTo = onNavigatingTo;
const app_1 = require("./app");
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = app_1.appViewModel;
}
