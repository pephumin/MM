import { action, EventData, ItemEventData, NavigatedData, Page, SearchBar, View } from '@nativescript/core'
import { QuestionViewModel } from '~/question/question-viewmodel'
import { Questions } from '~/common/items'
import { QuestionViewModelInstance } from '~/question/question-instance'

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = QuestionViewModelInstance;
}

export function onItemTap(args: ItemEventData) {
  const view = <View>args.view;
  const page = <Page>view.page;
  const tappedItem = <Questions>view.bindingContext;

  page.frame.navigate({
    moduleName: '~/question/question-itemdetail/question-itemdetail',
    context: tappedItem,
    animated: true,
    transition: {
      name: 'slide',
      duration: 200,
      curve: 'ease',
    },
  })
}

export function onSearchTextChanged(args: EventData) {
  const searchBar = <SearchBar>args.object;
  const page = searchBar.page;
  const vm = page.bindingContext as QuestionViewModel;
  vm.setSearchQuery(searchBar.text);
}

export function onSearchSubmit(args: EventData) {
  const searchBar = <SearchBar>args.object;
  const page = searchBar.page;
  const vm = page.bindingContext as QuestionViewModel;
  vm.setSearchQuery(searchBar.text);
}

export function onSearchClear(args: EventData) {
  const page = (<View>args.object).page;
  const vm = page.bindingContext as QuestionViewModel;
  vm.setSearchQuery('');
}