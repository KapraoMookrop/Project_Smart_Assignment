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

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginSearchVM },
  { path: 'dashboard', component: DashboardSearchVM },
  { path: 'categories', component: CategoryListSearchVM },
  { path: 'tasks/create', component: TaskCreateSearchVM },
  { path: 'tasks/:id', component: TaskDetailsSearchVM },
  { path: 'companies', component: CompanyListSearchVM },
  { path: 'companies/edit/:id', component: TenantEditSearchVM },
  { path: 'members/:categoryId', component: MemberManagementSearchVM },
  { path: 'team', component: TeamManagementSearchVM },
  { path: 'profile', component: ProfileViewSearchVM },
  { path: 'profile-edit', component: ProfileEditSearchVM },
];
