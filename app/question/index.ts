
import { EventData, Page, SearchBar } from '@nativescript/core';
import { QuestionViewModelInstance } from '~/common/instance';

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  if (!QuestionViewModelInstance.isLoaded) {
    QuestionViewModelInstance.loadItems();
  }
  page.bindingContext = QuestionViewModelInstance;
}

export function onSearchTextChanged(args: EventData) {
  const sb = <SearchBar>args.object;
  QuestionViewModelInstance.setSearchQuery(sb.text ?? '');
}

export function onSearchSubmit(args: EventData) {
  const sb = <SearchBar>args.object;
  QuestionViewModelInstance.setSearchQuery(sb.text ?? '');
}

export function onSearchClear(args: EventData) {
  QuestionViewModelInstance.setSearchQuery('');
}
