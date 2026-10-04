import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const isAuthenticated: CanActivateFn = (route, state) => {
  const authenticated = inject(UserService).isAuthenticated();
  const router = inject(Router);
  if (authenticated) return true;
  router.navigate(['/user', 'login']);
  return false;
};
