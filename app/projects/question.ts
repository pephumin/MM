import { EventData, Frame, ItemEventData, Page, SearchBar, View } from "@nativescript/core";
import { QuestionViewModelInstance as qvm } from "~/common/instance";
import type { Questions } from "~/common/items";

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;
  if (!qvm.isLoaded) {
    qvm.loadItems();
    qvm.isLoaded = true;
  }

  // optional filter or sort logic
  (qvm as any).applyFiltersAndSort?.();
  console.log("✅ onNavigatingTo — paged items:", qvm.items?.length ?? 0);

  page.bindingContext = qvm;

  // refresh properties for pagination & list state
  qvm.notifyPropertyChange("activeQuestions", qvm.activeQuestions);
  qvm.notifyPropertyChange("currentPage", qvm.currentPage);
}

let searchTimer: NodeJS.Timeout;

export function onSearchTextChanged(args: EventData) {
  const sb = args.object as SearchBar;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    qvm.setSearchQuery(sb.text?.trim() ?? "");
  }, 250);
}

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

export function showNextPage() {
  qvm.goNext();
  qvm.notifyPropertyChange("currentPage", qvm.currentPage);
}

export function showPreviousPage() {
  qvm.goPrev();
  qvm.notifyPropertyChange("currentPage", qvm.currentPage);
}

export function goBack(args: EventData) {
  const page = (args.object as View).page as Page;
  page.frame.goBack();
}

export function goProject() {
  console.log("🏠 Going to project index from question page...");

  // ✅ Do NOT unbind qvm listeners — keep reactivity alive
  // just reset transient filters/search
  qvm._searchQuery = "";
  qvm._filteredQuestions = [];
  qvm.notifyPropertyChange("activeQuestions", qvm.activeQuestions);

  // ✅ Clean up only the page binding
  Frame.topmost().navigate({
    moduleName: "~/projects/index",
    clearHistory: true,
    transition: { name: "fade", duration: 150 },
  });
}