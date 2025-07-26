import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard to keep authenticated users out of guest-only pages (e.g., login, signup)
export const GuestGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // If the user already has a valid token, redirect them to the dashboard
  if (authService.isTokenValid()) {
    router.navigate(['/home']);
    return false; // Block access to guest route
  }

  // No valid token → allow access to guest-only pages
  return true;
};
