import { EventData, NavigatedData, Page, View, Frame } from '@nativescript/core'
import { QViewModelInstance as qvm } from '~/common/instance'
import { Questions } from '~/common/items'

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page
  const ctx = args.context as Questions | undefined

  if (!qvm.isLoaded) {
    qvm.loadItems()
    qvm.isLoaded = true
  }

  page.bindingContext = qvm
  console.log('🧭 questiondetail loaded', ctx?.id ? `(questionId: ${ctx.id})` : '')
}

export function onBackButtonTap(args: EventData) {
  try {
    const view = args.object as View
    const page = view.page as Page
    const frame = Frame.topmost()

    console.log('🔙 Back button tapped — preparing to go back...')

    // 1️⃣ Temporarily detach the binding context to stop reactive updates
    page.bindingContext = null

    // 2️⃣ Pause any reactive updates
    if (typeof qvm.pauseReactivity === 'function') {
      qvm.pauseReactivity()
    } else {
      qvm._searchQuery = ''
    }

    // 3️⃣ Slight delay so native teardown finishes cleanly
    setTimeout(() => {
      if (frame?.canGoBack()) {
        console.log('⬅️ Navigating back now...')
        frame.goBack()
      } else {
        console.warn('⚠️ No previous page found!')
      }
    }, 80)
  } catch (err) {
    console.error('💥 Error on back navigation:', err)
  }
}