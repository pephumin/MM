import { QViewModel } from '~/question/q-viewmodel';
import { QuestionViewModel } from '~/projects/question-viewmodel';
import { ProjectViewModel } from '~/projects/project-viewmodel';
import { UserViewModel } from '~/user/user-viewmodel';

export const QViewModelInstance = new QViewModel();
export const ProjectViewModelInstance = new ProjectViewModel();
export const QuestionViewModelInstance = new QuestionViewModel();
export const UserViewModelInstance = new UserViewModel();
