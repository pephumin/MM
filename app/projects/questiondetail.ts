import { EventData, NavigatedData, Page, View } from '@nativescript/core';
import { QuestionViewModelInstance } from '~/projects/instance';
import { Questions } from '~/common/items';
import { createBindingContext } from '~/common/util';

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page;
  const context = args.context as { question: Questions; index: number } | undefined;

  if (context?.question) {
    QuestionViewModelInstance.setCurrentQuestion(context.question);
    QuestionViewModelInstance._currentIndex = context.question.id;
    console.log(context.question.type);
    if (context.question.type === "radiogroup" || context.question.type === "checkbox" || context.question.type === "multipletext") { page.bindingContext = createBindingContext(context.question); }
    else { page.bindingContext = context.question; }
    // console.log(`Showing question: ${context.question.title} (index: ${context.question.id})`);
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

export function goQuestion(args: EventData) {
  const view = args.object as View;
  const page = view.page as Page;
  if (!page.frame) { console.error('No frame found for goBack()!'); return; }
  page.frame.goBack();
}
