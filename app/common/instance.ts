import { QuestionViewModel } from '~/projects/question-viewmodel';
import { ProjectViewModel } from '~/projects/project-viewmodel';
import { UserViewModel } from '~/user/user-viewmodel';
import { AppViewModel, ThemeViewModel } from '~/app-viewmodel';

export const ProjectViewModelInstance = new ProjectViewModel();
export const QuestionViewModelInstance = new QuestionViewModel();
export const UserViewModelInstance = new UserViewModel();
export const AppViewModelInstance = new AppViewModel();
export const ThemeViewModelInstance = new ThemeViewModel();