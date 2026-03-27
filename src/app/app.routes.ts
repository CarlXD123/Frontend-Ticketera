import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { TaskList } from './tasks/task-list/task-list';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthGuard } from './auth/auth-guard'; 

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'tasks', component: TaskList },
      { 
        path: 'tasks/register', 
        loadComponent: () => import('./tickets/ticket-create/ticket-create').then(m => m.TicketCreate) 
      }
    ]
  },

  { path: '**', redirectTo: '' }
];