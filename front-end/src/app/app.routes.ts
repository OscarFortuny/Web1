import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';
import { profile } from 'console';

export const routes: Routes = [
  {path: '', component: Home },
  {path: 'contacte', component: Contact },
  {path:'nosaltres', component: About },
  {path:'perfil', component: profile },
  {path:'**', redirectTo: '' }
];
