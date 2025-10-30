import { EventData, Frame, NavigatedData, Page, View } from '@nativescript/core';
import { QuestionViewModelInstance as qvm } from '~/common/instance';

let pageRef: Page;

export function onNavigatingTo(args: NavigatedData) {
  pageRef = args.object as Page;

  if (!qvm.isLoaded) {
    qvm.loadItems();
    qvm.isLoaded = true;
  }

  const ctx = args.context || {};
  if (ctx.questionId != null) {
    qvm.setCurrentQuestion(Number(ctx.questionId));
  }

  // ✅ Re-emit bindings every time this page is navigated to
  qvm.notifyPropertyChange('currentQuestion', qvm.currentQuestion);
  qvm.notifyPropertyChange('canGoNext', qvm.canGoNext);
  qvm.notifyPropertyChange('canGoPrev', qvm.canGoPrev);

  pageRef.bindingContext = qvm;
  console.log('✅ questiondetail ready (rebound)');
}

// --- Navigation between questions ---
export function showNextQuestion(_: EventData) {
  if (!qvm.canGoNext) return;
  console.log('👉 next tapped');
  qvm.goNextQuestion();
  qvm.notifyPropertyChange('currentQuestion', qvm.currentQuestion);
}

export function showPreviousQuestion(_: EventData) {
  if (!qvm.canGoPrev) return;
  console.log('👈 prev tapped');
  qvm.goPreviousQuestion();
  qvm.notifyPropertyChange('currentQuestion', qvm.currentQuestion);
}

// --- Return to question list ---
export function goQuestion(_: EventData) {
  console.log('🔙 Back to question list');
  pageRef.bindingContext = null;

  // Important: do not clear qvm or remove its listeners
  setTimeout(() => {
    Frame.topmost().navigate({
      moduleName: '~/projects/question',
      clearHistory: false,
      transition: { name: 'slideRight', duration: 120 },
    });
  }, 50);
}

// --- Return to project home ---
export function goProject(_: EventData) {
  console.log('🏠 Going to project index');

  // Only clear lightweight state — keep items and listeners intact
  qvm._searchQuery = '';
  qvm._filteredQuestions = [];

  pageRef.bindingContext = null;

  Frame.topmost().navigate({
    moduleName: '~/projects/index',
    clearHistory: true,
    transition: { name: 'fade', duration: 150 },
  });
}