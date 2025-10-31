import { EventData, Frame, ListPicker, NavigatedData, Observable, Page } from '@nativescript/core';
import { QuestionViewModelInstance as qvm } from '~/common/instance';

let pageRef: Page;
let localVM: Observable;

/**
 * Fired when navigating to the question detail page.
 * Creates a local clone of qvm data for isolated binding.
 */
export function onNavigatingTo(args: NavigatedData) {
  pageRef = args.object as Page;
  const ctx = args.context || {};

  if (!qvm.isLoaded) {
    qvm.loadItems();
    qvm.isLoaded = true;
  }

  if (ctx.questionId != null) {
    qvm.setCurrentQuestion(Number(ctx.questionId));
  }

  // ✅ create detached observable clone (no reference link to qvm)
  localVM = new Observable();
  localVM.set('currentQuestion', JSON.parse(JSON.stringify(qvm.currentQuestion))); // clone data
  localVM.set('canGoNext', qvm.canGoNext);
  localVM.set('canGoPrev', qvm.canGoPrev);

  pageRef.bindingContext = localVM;
  console.log('✅ questiondetail bound to local clone');
}

/**
 * Go to next question.
 */
export function showNextQuestion() {
  if (!qvm.canGoNext) return;
  qvm.goNextQuestion();

  // safely clone again to avoid live object mutation from qvm
  localVM.set('currentQuestion', JSON.parse(JSON.stringify(qvm.currentQuestion)));
  localVM.set('canGoNext', qvm.canGoNext);
  localVM.set('canGoPrev', qvm.canGoPrev);
}

/**
 * Go to previous question.
 */
export function showPreviousQuestion() {
  if (!qvm.canGoPrev) return;
  qvm.goPreviousQuestion();

  localVM.set('currentQuestion', JSON.parse(JSON.stringify(qvm.currentQuestion)));
  localVM.set('canGoNext', qvm.canGoNext);
  localVM.set('canGoPrev', qvm.canGoPrev);
}

/**
 * Navigate back to the question list safely.
 */
export function goQuestion(_: EventData) {
  console.log('🔙 Going back safely');
  const frame = Frame.topmost();

  // tear down cleanly
  if (localVM) {
    localVM.off(Observable.propertyChangeEvent);
    localVM = null;
  }
  if (pageRef) pageRef.bindingContext = null;

  // delayed navigation avoids frozen UI on iOS
  setTimeout(() => {
    if (frame.canGoBack()) {
      frame.goBack();
    } else {
      frame.navigate({
        moduleName: '~/projects/question',
        transition: { name: 'slideRight', duration: 120 },
      });
    }
  }, 50);
}

/**
 * Navigate back to project index (home).
 */
export function goProject(_: EventData) {
  console.log('🏠 Going to project index');

  // clear transient state but preserve qvm items
  qvm._searchQuery = '';
  qvm._filteredQuestions = [];

  // unbind local context to release view references
  if (pageRef) pageRef.bindingContext = null;
  if (localVM) {
    localVM.off(Observable.propertyChangeEvent);
    localVM = null;
  }

  setTimeout(() => {
    Frame.topmost().navigate({
      moduleName: '~/projects/index',
      clearHistory: true,
      transition: { name: 'fade', duration: 150 },
    });
  }, 80);
}

/**
 * Handle matrix dropdown choice (ListPicker change)
 */
export function onMatrixChoiceChanged(args: EventData) {
  const picker = args.object as ListPicker;
  const binding = picker.bindingContext;

  if (!binding || !picker) return;

  binding.selectedIndex = picker.selectedIndex;
  const selected = binding.choiceTexts?.[picker.selectedIndex];
  console.log(`🎯 ${binding.title}: selected ${selected}`);
}

/**
 * Clean up when the page unloads to avoid freeze/leaks
 */
export function onUnloaded() {
  if (localVM) {
    localVM.off(Observable.propertyChangeEvent);
    localVM = null;
  }
  if (pageRef) pageRef.bindingContext = null;
  console.log('🧹 questiondetail page unloaded cleanly');
}