"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNavigatingTo = onNavigatingTo;
exports.onItemTap = onItemTap;
const browse_viewmodel_1 = require("./browse-viewmodel");
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new browse_viewmodel_1.BrowseViewModel();
}
function onItemTap(args) {
    const view = args.view;
    const page = view.page;
    const tappedItem = view.bindingContext;
    page.frame.navigate({
        moduleName: 'browse/browse-itemdetail/browse-itemdetail',
        context: tappedItem,
        animated: true,
        transition: {
            name: 'slide',
            duration: 200,
            curve: 'ease',
        },
    });
}
