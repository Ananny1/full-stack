import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Handles login flow: calls API and stores token on success
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map(({ user, token }) => {
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiry', (Date.now() + 8 * 60 * 60 * 1000).toString());
            return AuthActions.loginSuccess({ user, token });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error?.message || 'Login failed' }))
          )
        )
      )
    )
  );

  // Handles signup flow: calls API and stores token on success
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      exhaustMap((action) =>
        this.authService.signup(action.firstName, action.lastName, action.email, action.password).pipe(
          map(({ user, token }) => {
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiry', (Date.now() + 8 * 60 * 60 * 1000).toString());
            return AuthActions.signupSuccess({ user, token });
          }),
          catchError((error) =>
            of(AuthActions.signupFailure({ error: error.error?.message || 'Signup failed' }))
          )
        )
      )
    )
  );

  // Redirect to dashboard after successful login
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  // Redirect to dashboard after successful signup
  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  // Clears token and redirects to login on logout
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearToken();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  // Loads user profile if a valid token exists
  loadUserFromToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserFromToken),
      exhaustMap(() =>
        this.authService.getProfile().pipe(
          map((user) => {
            const token = this.authService.getToken();
            return AuthActions.loginSuccess({ user, token: token || '' });
          }),
          catchError(() => {
            this.authService.clearToken();
            this.router.navigate(['/login']);
            return of(AuthActions.logout());
          })
        )
      )
    )
  );
}
