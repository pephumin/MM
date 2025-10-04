import { EventData, NavigatedData, Page, View } from '@nativescript/core'
import { BrowseItem } from '../../common/items'

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page
  const items = args.context as BrowseItem
  page.bindingContext = items
}

export function onBackButtonTap(args: EventData) {
  const view = args.object as View
  const page = view.page as Page
  page.frame.goBack()
}
