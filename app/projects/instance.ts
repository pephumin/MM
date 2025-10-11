import { NavigatedData, Page } from '@nativescript/core'
import { ProjectViewModel } from '~/projects/project-viewmodel'
import { QuestionViewModel } from '~/projects/question-viewmodel'

export const ProjectViewModelInstance = new ProjectViewModel();
// export const QuestionViewModelInstance = new QuestionViewModel([], 0);
export const QuestionViewModelInstance = new QuestionViewModel([])
