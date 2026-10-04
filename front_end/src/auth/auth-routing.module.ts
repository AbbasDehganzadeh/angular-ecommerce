import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { isAuthenticated } from '../user/guards/user.guard';
import { SignUpComponent } from './pages/sign-up.component';
import { LogInComponent } from './pages/log-in.component';
import { LogOutComponent } from './pages/log-out.component';
import { ProfileComponent } from '../user-profile/pages/profile.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'login',
    component: LogInComponent,
  },
  {
    path: 'logout',
    component: LogOutComponent,
    canActivate: [isAuthenticated],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [isAuthenticated],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
