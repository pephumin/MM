import { EventData, Page } from "@nativescript/core";
import { UserViewModel } from "./user-viewmodel";
import { UserViewModelInstance } from './user-instance'

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = UserViewModelInstance;
}
