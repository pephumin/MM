import { EventData, NavigatedData, Page, View } from '@nativescript/core';
import { Questions } from '~/common/items';
import { QuestionViewModelInstance } from '~/projects/instance';

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page;
  const tappedItem = args.context as Questions;
  if (tappedItem) { QuestionViewModelInstance.setCurrentQuestion(tappedItem); }
  page.bindingContext = QuestionViewModelInstance;
}

export function onBackButtonTap(args: EventData) {
  const view = args.object as View;
  const page = view.page as Page;
  page.frame.goBack();
}
