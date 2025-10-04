"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNavigatingTo = onNavigatingTo;
const user_instance_1 = require("./user-instance");
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = user_instance_1.UserViewModelInstance;
}
