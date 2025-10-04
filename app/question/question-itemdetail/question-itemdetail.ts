import { EventData, NavigatedData, Page, View } from '@nativescript/core'
import { Questions } from '~/common/items'
import { QuestionViewModelInstance } from '~/question/question-instance'

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page
  const items = args.context as Questions
  page.bindingContext = QuestionViewModelInstance
}

export function onBackButtonTap(args: EventData) {
  const view = args.object as View
  const page = view.page as Page
  page.frame.goBack()
}
