import { EventData, Frame, ItemEventData, NavigatedData, Page, SearchBar, View } from '@nativescript/core'
import { QuestionViewModel } from '~/projects/question-viewmodel'
import { QuestionViewModelInstance } from '~/projects/instance'
import { Questions } from '~/common/items'

let QviewModel: QuestionViewModel;

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page;
  // if (!QuestionViewModelInstance.isLoaded) { QuestionViewModelInstance.loadItems(); QuestionViewModelInstance.isLoaded = true; }
  if (!page.bindingContext) { page.bindingContext = QuestionViewModelInstance; }
  if (QuestionViewModelInstance) { QviewModel = QuestionViewModelInstance; } 
  else if (args.context) {
    const { questions, currentIndex } = args.context;
    QviewModel = new QuestionViewModel(questions, currentIndex);
    Object.assign(QuestionViewModelInstance, QviewModel);
  } 
  else { console.error("No context or existing instance found"); return; }
  page.bindingContext = QuestionViewModelInstance;
}

export function onNavigatedFrom() {
  // Do nothing just to keep the viewmodel alive for back navigation
}

export function goBack(args: EventData) {
  const page = (args.object as View).page as Page;
  page.frame.goBack();
}

export function onItemTap(args: ItemEventData) {
  const tappedItem = args.view.bindingContext as Questions;
  const page = args.view.page;

  if (!tappedItem) {
    console.error('No tapped item found');
    return;
  }

  const currentIndex = QuestionViewModelInstance.items.findIndex(
    (q) => q.id === tappedItem.id
  );

  console.log(`Navigating to detail for: ${tappedItem.title} (index: ${currentIndex})`);

  page.frame.navigate({
    moduleName: '~/projects/questiondetail',
    context: {
      question: tappedItem,
      index: currentIndex,
    },
    clearHistory: false,
    animated: true,
    transition: {
      name: 'slide',
      duration: 200,
      curve: 'ease',
    },
  });
}

export function onSearchTextChanged(args: EventData) {
  const searchBar = args.object as SearchBar;
  QviewModel.setSearchQuery(searchBar.text);
}

export function onSearchSubmit(args: EventData) {
  const searchBar = args.object as SearchBar;
  QviewModel.setSearchQuery(searchBar.text);
}

export function onSearchClear(args: EventData) {
  QviewModel.setSearchQuery('');
}

export function onBackButtonTap(args: EventData) {
  const page = (args.object as View).page as Page;
  page.frame.goBack();
}