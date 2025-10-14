import { EventData, ItemEventData, NavigatedData, Page, SearchBar, View } from '@nativescript/core'
import { ProjectViewModel } from '~/projects/project-viewmodel'
import { ProjectItem } from '~/common/items'
import { ProjectViewModelInstance } from '~/projects/instance'

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = ProjectViewModelInstance;
}

export function onItemTap(args: ItemEventData) {
  const view = <View>args.view;
  const page = <Page>view.page;
  const tappedItem = <ProjectItem>view.bindingContext;

  page.frame.navigate({
    moduleName: '~/projects/projectdetail',
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
  const vm = page.bindingContext as ProjectViewModel;
  vm.setSearchQuery(searchBar.text);
}

export function onSearchSubmit(args: EventData) {
  const searchBar = <SearchBar>args.object;
  const page = searchBar.page;
  const vm = page.bindingContext as ProjectViewModel;
  vm.setSearchQuery(searchBar.text);
}

export function onSearchClear(args: EventData) {
  const page = (<View>args.object).page;
  const vm = page.bindingContext as ProjectViewModel;
  vm.setSearchQuery('');
}
