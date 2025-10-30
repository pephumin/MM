import { EventData, NavigatedData, Page, View } from '@nativescript/core'
import { UserViewModelInstance as uvm } from '~/common/instance'

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page;
  const ctx = args.context || {};

  // bind existing instance
  page.bindingContext = uvm;

  if (ctx.email) {
    uvm.email = ctx.email; // carry email forward
  }
}

export function goToLogin(args: EventData) {
  const view = args.object as View;
  const page = view.page as Page;

  setTimeout(() => {
    page.frame.navigate({
      moduleName: "~/user/index",
      context: { email: uvm.email },
      animated: true,
      transition: { name: "slideLeft", duration: 150 },
    });
  }, 0);
}

// export function onBackButtonTap(args: EventData) {
//   const view = args.object as View
//   const page = view.page as Page
//   page.frame.goBack()
// }

// export function goToLogin(args: EventData) {
//   const view = args.object as View;
//   const page = view.page as Page;
//   setTimeout(() => {
//     page.frame.navigate({
//       moduleName: "~/user/index",
//       clearHistory: true,
//       transition: { name: "slideRight", duration: 150 },
//     });
//   }, 0);
// }