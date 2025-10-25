import { EventData, NavigatedData, Page, View, Frame } from '@nativescript/core'
import { QViewModelInstance } from '~/common/instance'
import { Questions } from '~/common/items'

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page
  const ctx = args.context as Questions | undefined

  // Ensure ViewModel is bound and stable
  if (!QViewModelInstance.isLoaded) {
    QViewModelInstance.loadItems()
    QViewModelInstance.isLoaded = true
  }

  page.bindingContext = QViewModelInstance
  console.log('🧭 questiondetail bound successfully', ctx?.id ? `(questionId: ${ctx.id})` : '')
}

export function onBackButtonTap(args: EventData) {
  try {
    const view = args.object as View
    const page = view.page as Page

    // 🧹 Stop background reactivity before leaving
    if (QViewModelInstance.pauseReactivity) {
      QViewModelInstance.pauseReactivity()
    } else {
      // fallback if not implemented
      QViewModelInstance._searchQuery = ''
    }

    const frame = Frame.topmost()
    if (frame?.canGoBack()) {
      console.log('🔙 Going back safely...')
      setTimeout(() => frame.goBack(), 80) // Delay allows bindings to settle
    } else {
      console.warn('⚠️ No previous page in navigation stack')
    }
  } catch (err) {
    console.error('💥 Error during safe back navigation:', err)
  }
}