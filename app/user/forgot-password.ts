import { EventData, Frame, Page, View } from '@nativescript/core'
import { UserViewModel } from "~/user/user-viewmodel";
import { UserViewModelInstance } from '~/user/user-instance'

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = UserViewModelInstance;
}

export function onBackButtonTap(args: EventData) {
  const view = args.object as View
  const page = view.page as Page
  page.frame.goBack()
}
