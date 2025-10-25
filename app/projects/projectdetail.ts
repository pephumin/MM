import { EventData, Frame, NavigatedData, Page, SwipeGestureEventData, SwipeDirection, View } from '@nativescript/core';
import { ProjectViewModelInstance } from '~/common/instance'
import { ProjectItem } from '~/common/items';
import Questions77 from '~/common/question_77.json';

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page;
  const project = args.context as ProjectItem;
  if (!project) { console.error('No ProjectItem passed to ProjectDetail page!'); return; }
  page.bindingContext = project;
  page.on('swipe', (event: SwipeGestureEventData) => { 
    if (event.direction === SwipeDirection.right) {
      page.frame.goBack(); 
    } 
  });
}

export function onViewQuestions(args: EventData) {
  const view = args.object as View;
  const page = view.page as Page;
  const project = page.bindingContext as ProjectItem;
  if (!project) { console.error('ProjectItem is missing in page.bindingContext!'); return; }
  const questionsArray = project.id && project.title.length ? project.id : Questions77;

  page.frame.navigate({
    moduleName: '~/projects/question',
    context: {
      questions: questionsArray,
      currentQuestionId: 0
    },
    clearHistory: false,
    animated: true,
    transition: {
      name: 'slide',
      duration: 200,
      curve: 'ease'
    }
  });
}

export function goProject(args: EventData) {
  const view = args.object as View;
  const page = view.page as Page;
  if (!page.frame) { console.error('No frame found!'); return; }
  page.frame.goBack();
}