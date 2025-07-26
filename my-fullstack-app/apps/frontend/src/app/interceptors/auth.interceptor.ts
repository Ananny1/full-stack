import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../store/auth/auth.actions';

// This interceptor automatically attaches the JWT token to outgoing HTTP requests
// and handles unauthorized (401) responses by logging the user out.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const store = inject(Store);

  // Try to get the token from localStorage
  const token = authService.getToken();
  
  let authReq = req;
  // If a valid token exists, clone the request and add the Authorization header
  if (token && authService.isTokenValid()) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  // Pass the (possibly modified) request down the pipeline
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the server responds with 401 Unauthorized,
      // dispatch a logout action to clear user session
      if (error.status === 401) {
        store.dispatch(AuthActions.logout());
      }
      // Re-throw the error so components can handle it if needed
      return throwError(() => error);
    })
  );
};
