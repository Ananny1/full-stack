import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

// Route guard to protect pages that require authentication.
// Checks token validity and loads user data if needed.
export const AuthGuard: CanActivateFn = (): Observable<boolean> => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  // If a valid token exists in localStorage
  if (authService.isTokenValid()) {
    return store.select(selectIsAuthenticated).pipe(
      take(1), // Only take the current state, no need to listen continuously
      map(isAuthenticated => {
        // If token is valid but store has no user info, load user from token
        if (!isAuthenticated) {
          store.dispatch(AuthActions.loadUserFromToken());
          return true;
        }
        // User is already authenticated in store
        return true;
      })
    );
  } else {
    // No valid token → redirect to login page
    router.navigate(['/login']);
    return of(false); // Block route activation
  }
};
