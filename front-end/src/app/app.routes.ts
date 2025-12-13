import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';
import { Profile } from './pages/profile/profile';
import { Result } from './pages/result/result';
import { Search } from './pages/search/search';

export const routes: Routes = [
  {path: '', component: Home },
  {path: 'contact', component: Contact },
  {path:'about', component: About },
  {path:'profile', component: Profile },
  {path:'result',component: Result},
  {path:'search',component: Search},
  {path:'**', redirectTo: '' }
];
