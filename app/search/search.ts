import { action, EventData, ItemEventData, NavigatedData, Page, SearchBar, View } from '@nativescript/core'
// import { NavigatedData, Page } from '@nativescript/core'
import { SearchViewModel } from '~/search/search-viewmodel'
import { SearchViewModelInstance } from '~/search/search-instance'


import { HomeViewModel } from '~/home/home-viewmodel'
import { HomeItem } from '~/common/items'

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = new SearchViewModel()
}

export function onItemTap(args: ItemEventData) {
  const view = <View>args.view;
  const page = <Page>view.page;
  const tappedItem = <HomeItem>view.bindingContext;

  page.frame.navigate({
    moduleName: '~/search/results/results',
    context: tappedItem,
    animated: true,
    transition: {
      name: 'slide',
      duration: 200,
      curve: 'ease',
    },
  });
}

export function onSearchTextChanged(args: EventData) {
  const searchBar = <SearchBar>args.object;
  const page = searchBar.page;
  const vm = page.bindingContext as HomeViewModel;
  vm.setSearchQuery(searchBar.text);
}

export function onSearchSubmit(args: EventData) {
  const searchBar = <SearchBar>args.object;
  const page = searchBar.page;
  const vm = page.bindingContext as HomeViewModel;
  vm.setSearchQuery(searchBar.text);
}

export function onSearchClear(args: EventData) {
  const page = (<View>args.object).page;
  const vm = page.bindingContext as HomeViewModel;
  vm.setSearchQuery('');
}