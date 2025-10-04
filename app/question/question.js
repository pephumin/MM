"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNavigatingTo = onNavigatingTo;
exports.onItemTap = onItemTap;
exports.onSearchTextChanged = onSearchTextChanged;
exports.onSearchSubmit = onSearchSubmit;
exports.onSearchClear = onSearchClear;
const question_instance_1 = require("./question-instance");
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = question_instance_1.QuestionViewModelInstance;
}
function onItemTap(args) {
    const view = args.view;
    const page = view.page;
    const tappedItem = view.bindingContext;
    page.frame.navigate({
        moduleName: 'question/question-itemdetail/question-itemdetail',
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
    page.bindingContext = question_instance_1.QuestionViewModelInstance;
    question_instance_1.QuestionViewModelInstance.setSearchQuery(searchBar.text);
}
function onSearchSubmit(args) {
    const searchBar = args.object;
    const page = searchBar.page;
    page.bindingContext = question_instance_1.QuestionViewModelInstance;
    question_instance_1.QuestionViewModelInstance.setSearchQuery(searchBar.text);
}
function onSearchClear(args) {
    const page = args.object.page;
    page.bindingContext = question_instance_1.QuestionViewModelInstance;
    question_instance_1.QuestionViewModelInstance.setSearchQuery('');
}
