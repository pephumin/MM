import { appViewModel } from './app';

export function onNavigatingTo(args) {
  const page = args.object;
  page.bindingContext = appViewModel;
}