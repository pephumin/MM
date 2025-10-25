import { EventData, Frame, Page, PropertyChangeData, TextField } from "@nativescript/core";
import { UserViewModel } from "./user-viewmodel";
import { UserViewModelInstance } from './user-instance'
import { LowerCase } from "~/common/util";

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = UserViewModelInstance;
}

export function onLoginTextChanged(args: PropertyChangeData) {
  const textField = args.object as TextField;
  console.log('TextField text changed:', textField.text);
  const updatedValue = LowerCase(args.value);
  console.log('New value:', updatedValue);
  if (textField.text !== args.value) { textField.text = updatedValue; }
}



