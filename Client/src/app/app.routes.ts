import { Routes } from '@angular/router';
import { DashboardSearchVM } from './pages/dashboard/DashboardSearchVM';
import { CategoryListSearchVM } from './pages/category-list/CategoryListSearchVM';
import { TaskCreateSearchVM } from './pages/task-create/TaskCreateSearchVM';
import { TaskDetailsSearchVM } from './pages/task-details/TaskDetailsSearchVM';
import { CompanyListSearchVM } from './pages/company-list/CompanyListSearchVM';
import { MemberManagementSearchVM } from './pages/member-management/MemberManagementSearchVM';
import { LoginSearchVM } from './pages/login/LoginSearchVM';
import { TenantEditSearchVM } from './pages/tenant-edit/TenantEditSearchVM';
import { ProfileEditSearchVM } from './pages/profile-edit/ProfileEditSearchVM';
import { TeamManagementSearchVM } from './pages/team-management/TeamManagementSearchVM';
import { ProfileViewSearchVM } from './pages/profile-view/ProfileViewSearchVM';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginSearchVM },
  { path: 'dashboard', component: DashboardSearchVM, canActivate: [authGuard] },
  { path: 'categories', component: CategoryListSearchVM, canActivate: [authGuard] },
  { path: 'tasks/create', component: TaskCreateSearchVM, canActivate: [authGuard] },
  { path: 'tasks/:id', component: TaskDetailsSearchVM, canActivate: [authGuard] },
  { path: 'companies', component: CompanyListSearchVM, canActivate: [authGuard] },
  { path: 'companies/edit/:id', component: TenantEditSearchVM, canActivate: [authGuard] },
  { path: 'members/:categoryId', component: MemberManagementSearchVM, canActivate: [authGuard] },
  { path: 'team', component: TeamManagementSearchVM, canActivate: [authGuard] },
  { path: 'profile', component: ProfileViewSearchVM, canActivate: [authGuard] },
  { path: 'profile-edit', component: ProfileEditSearchVM, canActivate: [authGuard] },
];
