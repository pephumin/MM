import { action, EventData, ItemEventData, NavigatedData, Page, SearchBar, View } from '@nativescript/core'
import { HomeViewModel } from '~/home/home-viewmodel'
import { HomeItem } from '~/common/items'
import { HomeViewModelInstance } from '~/home/home-instance'

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = HomeViewModelInstance;
}

export function onItemTap(args: ItemEventData) {
  const view = <View>args.view;
  const page = <Page>view.page;
  const tappedItem = <HomeItem>view.bindingContext;

  page.frame.navigate({
    moduleName: '~/home/homedetail',
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

export function onBackButtonTap(args: EventData) {
  const view = args.object as View
  const page = view.page as Page
  page.frame.goBack()
}
