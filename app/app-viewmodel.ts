import { Observable } from '@nativescript/core';

/**
 * ViewModel for managing application-level state
 */
export class AppViewModel extends Observable {
  private _selectedTabIndex: number = 0;

  constructor() {
    super();
  }

  /** Get the currently selected tab index */
  get selectedTabIndex(): number {
    return this._selectedTabIndex;
  }

  /** Set the selected tab index */
  set selectedTabIndex(value: number) {
    if (this._selectedTabIndex !== value) {
      this._selectedTabIndex = value;
      this.notifyPropertyChange('selectedTabIndex', value);
    }
  }

  /**
   * Navigate to a specific tab
   * @param index The index of the tab to select
   */
  navigateToTab(index: number): void {
    if (index >= 0 && index <= 3) {
      this.selectedTabIndex = index;
    }
  }
}