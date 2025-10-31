import { EventData, Page, View } from "@nativescript/core";
import { UserViewModelInstance as uvm } from "~/common/instance";

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  page.bindingContext = uvm;
}

export function goToRegistration(args: EventData) {
  const view = args.object as View;
  const page = view.page as Page;

  setTimeout(() => {
    page.frame.navigate({
      moduleName: "~/user/registration",
      context: { email: uvm.email },
      animated: true,
      transition: { name: "slideLeft", duration: 150 },
    });
  }, 0);
}

export function goToForgotPassword(args: EventData) {
  const view = args.object as View;
  const page = view.page as Page;

  setTimeout(() => {
    page.frame.navigate({
      moduleName: "~/user/forgot-password",
      context: { email: uvm.email },
      animated: true,
      transition: { name: "slideLeft", duration: 150 },
    });
  }, 0);
}
