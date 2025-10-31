import { EventData, Frame, ItemEventData, Page, SearchBar, View } from "@nativescript/core";
import { QuestionViewModelInstance as qvm } from "~/common/instance";
import type { Questions } from "~/common/items";

let searchTimer: NodeJS.Timeout;

export function onNavigatingTo(args: EventData) {
  const page = args.object as Page;

  // Load data once per app session
  if (!qvm.isLoaded) {
    qvm.loadItems();
    qvm.isLoaded = true;
  }

  // Optional: ensure sorting/filtering before bind
  (qvm as any).applyFiltersAndSort?.();

  // Bind the shared viewmodel
  page.bindingContext = qvm;

  // Notify UI that data is fresh
  qvm.notifyPropertyChange("activeQuestions", qvm.activeQuestions);
  qvm.notifyPropertyChange("currentPage", (qvm as any)._currentPage ?? qvm.currentPage);

  console.log("✅ Question page ready — items:", qvm.items?.length ?? 0);
}

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

  // Defer navigation slightly to avoid overlapping UI events
  setTimeout(() => {
    Frame.topmost().navigate({
      moduleName: "projects/questiondetail",
      context: { questionId: tappedItem.id },
      clearHistory: false,
      animated: true,
      transition: { name: "slide", duration: 180, curve: "easeInOut" },
    });
  }, 50);
}

export function showNextPage() {
  qvm.goNext();
  qvm.notifyPropertyChange("currentPage", (qvm as any)._currentPage ?? qvm.currentPage);
}

export function showPreviousPage() {
  qvm.goPrev();
  qvm.notifyPropertyChange("currentPage", (qvm as any)._currentPage ?? qvm.currentPage);
}

export function goBack(args: EventData) {
  const page = (args.object as View).page as Page;
  const frame = page.frame;

  // Avoid multiple back calls
  if (frame.canGoBack()) {
    frame.goBack();
  } else {
    Frame.topmost().navigate({
      moduleName: "~/projects/index",
      transition: { name: "slideRight", duration: 150 },
    });
  }
}

export function goProject() {
  console.log("🏠 Going to project index from question page...");

  // Keep ViewModel reactive but clear transient filters
  qvm._searchQuery = "";
  qvm._filteredQuestions = [];
  qvm.notifyPropertyChange("activeQuestions", qvm.activeQuestions);

  // Safe async navigation
  setTimeout(() => {
    Frame.topmost().navigate({
      moduleName: "~/projects/index",
      clearHistory: true,
      transition: { name: "fade", duration: 150 },
    });
  }, 50);
}