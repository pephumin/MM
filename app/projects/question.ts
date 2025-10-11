import { EventData, ItemEventData, NavigatedData, Page, SearchBar, View } from '@nativescript/core'
import { QuestionViewModel } from '~/projects/question-viewmodel'
import { QuestionViewModelInstance } from '~/projects/instance'

let QviewModel: QuestionViewModel;

// export function onNavigatingTo(args: NavigatedData) {
//   const page = args.object as Page;
//   if (!args.context) { console.error("NavigatedData context: undefined"); return; }
//   const { questions, currentIndex } = args.context || { questions: [], currentIndex: 0 };
//   if (!QviewModel || QviewModel.questions !== questions) {
//     QviewModel = new QuestionViewModel(questions, currentIndex);
//   }
//   page.bindingContext = QviewModel;
// }

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page;

  if (!QuestionViewModelInstance.isLoaded) {
    QuestionViewModelInstance.loadItems();
    QuestionViewModelInstance.isLoaded = true;
  }

  if (QuestionViewModelInstance && QuestionViewModelInstance.questions?.length > 0) {
    // console.log("Reusing existing QuestionViewModel instance");
    QviewModel = QuestionViewModelInstance;
  } 
  else if (args.context) {
    const { questions, currentIndex } = args.context;
    // console.log("Creating new QuestionViewModel with context");
    QviewModel = new QuestionViewModel(questions, currentIndex);

    Object.assign(QuestionViewModelInstance, QviewModel);
  } 
  else { console.error("No context or existing instance found"); return; }

  // page.bindingContext = QviewModel;
  page.bindingContext = QuestionViewModelInstance;
}

export function onNavigatedFrom() {
  // ❗ Do nothing — we keep the view model alive for back navigation
}

export function goBack(args: EventData) {
  const page = (args.object as View).page as Page;
  page.frame.goBack();
}

export function onItemTap(args: ItemEventData) {
  const view = args.view as View;
  const page = view.page as Page;
  const tappedItem = view.bindingContext;
  console.log('Tapped item:', tappedItem);
  if (!tappedItem) { console.error('Tapped item is undefined!'); return; }
  page.frame.navigate({
    moduleName: '~/projects/questiondetail',
    context: tappedItem,
    clearHistory: false,
    animated: true,
    transition: { 
      name: 'slide', 
      duration: 200, 
      curve: 'ease' 
    }
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