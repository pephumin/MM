import { EventData, NavigatedData, Page, View } from '@nativescript/core';
import { ProjectItem } from '~/common/items';
import { ProjectViewModelInstance } from '~/projects/instance'
import Questions77 from '~/common/question_77.json'; // fallback questions

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page;
  const project = args.context as ProjectItem;
  if (!project) { console.error('No ProjectItem passed to ProjectDetail page!'); return; }
  page.bindingContext = project;
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
      currentIndex: 0
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
  if (!page.frame) { console.error('No frame found for goBack()!'); return; }
  page.frame.goBack();
}
