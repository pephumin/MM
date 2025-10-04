import { EventData, Frame, Page, PropertyChangeData, TextField } from "@nativescript/core";
import { UserViewModel } from "./user-viewmodel";
import { UserViewModelInstance } from './user-instance'
import { LowerCase } from "~/common/util";

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = UserViewModelInstance;
}

// export function onNavigatingToDestination(args: EventData) {
//   const page = <Page>args.object;
//   page.bindingContext = UserViewModelInstance;

//   let destination: string;
//   const LinkId = (args.object as any).id;
//   console.log(LinkId);

//   if (LinkId === 'link1') { destination = '~/user/registration'; } 
//   else if (LinkId === 'link2') { destination = '~/user/forgot-password'; }
//   else if (LinkId === 'link3') { destination = '~/user/login'; }
//   else if (LinkId === 'link4') { destination = '~/home/fhome'; }
//   Frame.topmost().navigate(destination);
// }

export function onTextChange(args: PropertyChangeData) {
  const textField = args.object as TextField;
  console.log('TextField text changed:', textField.text);
  const updatedValue = LowerCase(args.value)
  console.log('New value:', updatedValue);
  if (textField.text !== args.value) { textField.text = updatedValue; }
}