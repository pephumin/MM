"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNavigatingTo = onNavigatingTo;
const search_viewmodel_1 = require("./search-viewmodel");
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new search_viewmodel_1.SearchViewModel();
}
