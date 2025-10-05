import { Observable } from '@nativescript/core';

export class AppViewModel extends Observable {
  private _selectedTabIndex: number = 0;

  constructor() {
    super();
  }

  get selectedTabIndex(): number { return this._selectedTabIndex; }
  set selectedTabIndex(value: number) { if (this._selectedTabIndex !== value) { this._selectedTabIndex = value; this.notifyPropertyChange('selectedTabIndex', value); } }

  navigateToTab(index: number): void { if (index >= 0 && index <= 3) { this.selectedTabIndex = index; } }
}