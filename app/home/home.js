"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNavigatingTo = onNavigatingTo;
exports.onItemTap = onItemTap;
exports.onSearchTextChanged = onSearchTextChanged;
exports.onSearchSubmit = onSearchSubmit;
exports.onSearchClear = onSearchClear;
const home_instance_1 = require("./home-instance");
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = home_instance_1.HomeViewModelInstance;
}
function onItemTap(args) {
    const view = args.view;
    const page = view.page;
    const tappedItem = view.bindingContext;
    page.frame.navigate({
        moduleName: 'home/home-itemdetail/home-itemdetail',
        context: tappedItem,
        animated: true,
        transition: {
            name: 'slide',
            duration: 200,
            curve: 'ease',
        },
    });
}
function onSearchTextChanged(args) {
    const searchBar = args.object;
    const page = searchBar.page;
    const vm = page.bindingContext;
    vm.setSearchQuery(searchBar.text);
}
function onSearchSubmit(args) {
    const searchBar = args.object;
    const page = searchBar.page;
    const vm = page.bindingContext;
    vm.setSearchQuery(searchBar.text);
}
function onSearchClear(args) {
    const page = args.object.page;
    const vm = page.bindingContext;
    vm.setSearchQuery('');
}
