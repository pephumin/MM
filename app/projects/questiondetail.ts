// import { EventData, ItemEventData, NavigatedData, Page, View } from '@nativescript/core';
// import { Questions } from '~/common/items';
// import { QuestionViewModelInstance } from '~/projects/instance';


// export function onItemTap(args: ItemEventData) {
//   const tappedItem = args.view.bindingContext as Questions;
//   const page = args.view.page;

//   if (!tappedItem) {
//     console.error('No tapped item found');
//     return;
//   }

//   console.log('Navigating to question detail for:', tappedItem.title);

//   page.frame.navigate({
//     moduleName: '~/projects/questiondetail',
//     context: tappedItem,
//     clearHistory: false,
//     animated: true,
//     transition: {
//       name: 'slide',
//       duration: 200,
//       curve: 'ease',
//     },
//   });
// }

// export function onNavigatingTo(args: NavigatedData) {
//   const page = args.object as Page;
//   const context = args.context as Questions | undefined;

//   if (context) {
//     QuestionViewModelInstance.setCurrentQuestion(context);
//     page.bindingContext = context.question;
//     console.log('Bound question:', context.question.title);
//   } else {
//     console.warn('No context found. Using instance state.');
//     page.bindingContext = QuestionViewModelInstance;
//   }
// }

// export function onBackButtonTap(args: EventData) {
//   const page = (args.object as View).page;
//   page.frame.goBack();
// }

import { EventData, NavigatedData, Page, View } from '@nativescript/core';
import { QuestionViewModelInstance } from '~/projects/instance';
import { Questions } from '~/common/items';

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page;
  const context = args.context as { question: Questions; index: number } | undefined;

  if (context?.question) {
    // Update global instance to current question
    QuestionViewModelInstance.setCurrentQuestion(context.question);
    QuestionViewModelInstance._currentIndex = context.question.id;

    // Bind directly to the question for display
    page.bindingContext = context.question;

    console.log(`Showing question: ${context.question.title} (index: ${context.index})`);
  } else {
    console.warn('No context found. Using QuestionViewModelInstance.');
    page.bindingContext = QuestionViewModelInstance.currentQuestion;
  }
}

export function onBackButtonTap(args: EventData) {
  const page = (args.object as View).page;
  page.frame.goBack();
}

export function onNextTap(args: EventData) {
  QuestionViewModelInstance.goDNext();
  (args.object as View).page.bindingContext = QuestionViewModelInstance.currentQuestion;
}

export function onPreviousTap(args: EventData) {
  QuestionViewModelInstance.goDPrev();
  (args.object as View).page.bindingContext = QuestionViewModelInstance.currentQuestion;
}
