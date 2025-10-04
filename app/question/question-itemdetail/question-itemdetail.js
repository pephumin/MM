"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNavigatingTo = onNavigatingTo;
exports.onBackButtonTap = onBackButtonTap;
function onNavigatingTo(args) {
    const page = args.object;
    const items = args.context;
    page.bindingContext = items;
}
function onBackButtonTap(args) {
    const view = args.object;
    const page = view.page;
    page.frame.goBack();
}
