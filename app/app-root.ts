import { appViewModel } from './app';
// import { Frame, SwipeGestureEventData, SwipeDirection  } from '@nativescript/core';

export function onNavigatingTo(args) {
  const page = args.object;
  page.bindingContext = appViewModel;
}

// export function onSwipe(args: SwipeGestureEventData) {
//   if (args.direction === SwipeDirection.right) {
//     const frame = Frame.topmost();
//     if (frame && frame.canGoBack()) { frame.goBack(); }
//   }
// }