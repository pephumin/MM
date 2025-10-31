import { Application, EventData, ListPicker, Observable, Page, View } from '@nativescript/core';
import { AppViewModelInstance as avm } from '~/common/instance';
import { ThemeViewModelInstance as tvm } from '~/common/instance';
import Theme from '@nativescript/theme';

export class AppViewModel extends Observable {
  private _selectedTabIndex: number = 0;

  constructor() {
    super();
  }

  get selectedTabIndex(): number {
    return this._selectedTabIndex;
  }

  set selectedTabIndex(value: number) {
    if (this._selectedTabIndex !== value) {
      this._selectedTabIndex = value;
      this.notifyPropertyChange('selectedTabIndex', value);
    }
  }

  navigateToTab(index: number): void {
    if (index >= 0 && index <= 3) {
      this.selectedTabIndex = index;
    }
  }
}

export class ThemeViewModel extends Observable {
  themeOptions = ['Light', 'Dark', 'System'];
  selectedThemeIndex = 0;

  constructor() {
    super();

    // Automatically match current system theme
    const systemTheme = Application.systemAppearance?.() ?? 'light';
    if (systemTheme === 'dark') {
      this.selectedThemeIndex = 2;
    }
  }

  applyTheme(index: number) {
    try {
      switch (index) {
        case 0: // Light
          Theme.setMode(Theme.Light);
          Application.setCssFileName('themes/light.css');
          break;

        case 1: // Dark
          Theme.setMode(Theme.Dark);
          Application.setCssFileName('themes/dark.css');
          break;

        case 2: // Follow system
        default:
          const appearance = Application.systemAppearance?.() ?? 'light';
          Theme.setMode(appearance === 'dark' ? Theme.Dark : Theme.Light);
          Application.setCssFileName(`themes/${appearance}.css`);
          break;
      }

      Application.reloadCss();
      console.log(`🎨 Theme applied: ${this.themeOptions[index]}`);
    } catch (err) {
      console.error('❌ Theme change failed:', err);
    }
  }
}

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  page.bindingContext = tvm;
}

export function onThemeChanged(args: EventData) {
  const picker = args.object as ListPicker;
  tvm.applyTheme(picker.selectedIndex);
}