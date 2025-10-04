"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppViewModel = void 0;
const core_1 = require("@nativescript/core");
/**
 * ViewModel for managing application-level state
 */
class AppViewModel extends core_1.Observable {
    constructor() {
        super();
        this._selectedTabIndex = 0;
    }
    /** Get the currently selected tab index */
    get selectedTabIndex() {
        return this._selectedTabIndex;
    }
    /** Set the selected tab index */
    set selectedTabIndex(value) {
        if (this._selectedTabIndex !== value) {
            this._selectedTabIndex = value;
            this.notifyPropertyChange('selectedTabIndex', value);
        }
    }
    /**
     * Navigate to a specific tab
     * @param index The index of the tab to select
     */
    navigateToTab(index) {
        if (index >= 0 && index <= 3) {
            this.selectedTabIndex = index;
        }
    }
}
exports.AppViewModel = AppViewModel;
