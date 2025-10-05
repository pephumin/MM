import { ItemEventData, NavigatedData, Page, View } from '@nativescript/core'
import { BrowseViewModel } from '~/browse/browse-viewmodel'
import { BrowseItem } from '~/common/items'
import { BrowseViewModelInstance } from '~/browse/browse-instance'

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = BrowseViewModelInstance;
}

export function onItemTap(args: ItemEventData) {
  const view = <View>args.view
  const page = <Page>view.page
  const tappedItem = <BrowseItem>view.bindingContext

  page.frame.navigate({
    moduleName: '~/browse/browse-itemdetail/browse-itemdetail',
    context: tappedItem,
    animated: true,
    transition: {
      name: 'slide',
      duration: 200,
      curve: 'ease',
    },
  })
}