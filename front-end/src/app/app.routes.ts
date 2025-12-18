import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Profile } from './pages/profile/profile';
import { Result } from './pages/result/result';
import { Search } from './pages/search/search';
import { CreateGroup } from './pages/create-group/create-group';
import { Login } from './pages/login/login';
import { Chat } from './pages/chat/chat';

export const routes: Routes = [
  {path: '', component: Home },
  {path:'about', component: About },
  {path:'profile', component: Profile },
  {path:'result',component: Result},
  {path:'search',component: Search},
  {path:'create-group',component: CreateGroup},
  {path:'login',component: Login},
  {path:'chat',component: Chat},
  {path:'**', redirectTo: '' }
];
