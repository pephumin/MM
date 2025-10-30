import { EventData, Frame, ItemEventData, Page, SearchBar, View } from "@nativescript/core";
import { QuestionViewModelInstance as qvm } from "~/common/instance";
import type { Questions } from "~/common/items";

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  if (!qvm.isLoaded) { qvm.loadItems(); qvm.isLoaded = true; }
  (qvm as any).applyFiltersAndSort?.();
  console.log("✅ onNavigatingTo — paged items:", qvm.items?.length ?? 0);
  page.bindingContext = qvm;
}

let searchTimer: NodeJS.Timeout;

export function onSearchTextChanged(args: EventData) {
  const sb = args.object as SearchBar;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    qvm.setSearchQuery(sb.text?.trim() ?? "");
  }, 250);
}

// export function onSearchTextChanged(args: EventData) {
//   const sb = args.object as SearchBar;
//   qvm.setSearchQuery(sb.text?.trim() ?? "");
// }

export function onSearchSubmit(args: EventData) {
  const sb = args.object as SearchBar;
  qvm.setSearchQuery(sb.text?.trim() ?? "");
}

export function onSearchClear() {
  qvm.setSearchQuery("");
}

export function onItemTap(args: ItemEventData) {
  const tappedItem = args.view?.bindingContext as Questions;
  if (!tappedItem) return;
  qvm.setCurrentQuestion(tappedItem.id);

  Frame.topmost().navigate({
    moduleName: "projects/questiondetail",
    context: { questionId: tappedItem.id },
    clearHistory: false,
    animated: true,
    transition: { name: "slide", duration: 200, curve: "ease" },
  });
}

export function showNextPage() { qvm.goNext(); }
export function showPreviousPage() { qvm.goPrev(); }
export function goBack(args: EventData) {
  const page = (args.object as View).page as Page;
  page.frame.goBack();
}

// export function goProject() {
//   // 💣 Before clearing history, detach listeners from singleton
//   qvm.off(Observable.propertyChangeEvent);
//   qvm.isLoaded = false; // force reload next time
//   qvm._filteredQuestions = [];
//   qvm._searchQuery = "";
//   qvm._items.splice(0);
//   // 🧹 Cleanly unbind, but don't mutate qvm yet
//   page.bindingContext = null;

//   setTimeout(() => {
//     console.log('🏠 Navigating home (safe clear)...');
//     Frame.topmost().navigate({
//       moduleName: "~/projects/index",
//       clearHistory: true,
//       transition: { name: "fade", duration: 150 },
//     });
//   }, 50);
// }

export function goProject() {
  // 💣 Before clearing history, detach listeners from singleton
  qvm.off(Observable.propertyChangeEvent);
  qvm.isLoaded = false; // force reload next time
  qvm._filteredQuestions = [];
  qvm._searchQuery = "";
  qvm._items.splice(0);

  setTimeout(() => {
    console.log('🏠 Navigating home (safe clear)...');
    Frame.topmost().navigate({
      moduleName: "~/projects/index",
      clearHistory: true,
      transition: { name: "fade", duration: 150 },
    });
  }, 50);
}
