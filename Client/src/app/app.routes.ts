import { Routes } from '@angular/router';
import { DashboardSearchVM } from './pages/dashboard/DashboardSearchVM';
import { CategoryListSearchVM } from './pages/category-list/CategoryListSearchVM';
import { TaskCreateSearchVM } from './pages/task-create/TaskCreateSearchVM';
import { TaskDetailsSearchVM } from './pages/task-details/TaskDetailsSearchVM';
import { CompanyListSearchVM } from './pages/company-list/CompanyListSearchVM';
import { CategoryMemberEditSearchVM } from './pages/category-member-edit/CategoryMemberEditSearchVM';
import { LoginSearchVM } from './pages/login/LoginSearchVM';
import { CompanyEditSearchVM } from './pages/company-edit/CompanyEditSearchVM';
import { ProfileEditSearchVM } from './pages/profile-edit/ProfileEditSearchVM';
import { EmployeeListSearchVM } from './pages/employee-list/EmployeeListSearchVM';
import { ProfileViewSearchVM } from './pages/profile-view/ProfileViewSearchVM';
import { CategoryEditSearchVM } from './pages/category-edit/CategoryEditSearchVM';
import { EmployeeEditSearchVM } from './pages/employee-edit/EmployeeEditSearchVM';
import { TaskEditSearchVM } from './pages/task-edit/TaskEditSearchVM';
import { TaskListSearchVM } from './pages/task-list/TaskListSearchVM';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginSearchVM },
  { path: 'dashboard', component: DashboardSearchVM, canActivate: [authGuard] },
  { path: 'categories', component: CategoryListSearchVM, canActivate: [authGuard] },
  { path: 'categories/:companyId', component: CategoryListSearchVM, canActivate: [authGuard] },
  { path: 'categories/edit/:id', component: CategoryEditSearchVM, canActivate: [authGuard] },
  { path: 'tasks/create', component: TaskCreateSearchVM, canActivate: [authGuard] },
  { path: 'tasks/created', component: TaskListSearchVM, canActivate: [authGuard], data: { type: 'created' } },
  { path: 'tasks/my-tasks', component: TaskListSearchVM, canActivate: [authGuard], data: { type: 'assigned' } },
  { path: 'tasks/:id', component: TaskDetailsSearchVM, canActivate: [authGuard] },
  { path: 'tasks/edit/:id', component: TaskEditSearchVM, canActivate: [authGuard] },
  { path: 'tasks/details/:id', component: TaskDetailsSearchVM, canActivate: [authGuard] },
  { path: 'companies', component: CompanyListSearchVM, canActivate: [authGuard] },
  { path: 'companies/edit/:id', component: CompanyEditSearchVM, canActivate: [authGuard] },
  { path: 'members/:categoryId', component: CategoryMemberEditSearchVM, canActivate: [authGuard] },
  { path: 'employees', component: EmployeeListSearchVM, canActivate: [authGuard] },
  { path: 'employees/:companyId', component: EmployeeListSearchVM, canActivate: [authGuard] },
  { path: 'employees/edit/:id', component: EmployeeEditSearchVM, canActivate: [authGuard] },
  { path: 'profile', component: ProfileViewSearchVM, canActivate: [authGuard] },
  { path: 'profile-edit', component: ProfileEditSearchVM, canActivate: [authGuard] },
];
