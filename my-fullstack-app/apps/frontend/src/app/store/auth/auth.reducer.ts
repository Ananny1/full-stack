import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

// Manages how auth state changes based on actions
export const authReducer = createReducer(
  initialAuthState,

  // When login starts: show loading, clear errors
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Login success: save user/token, set authenticated
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
    isAuthenticated: true,
  })),

  // Login failure: stop loading, show error
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  // When signup starts: show loading, clear errors
  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Signup success: save user/token, set authenticated
  on(AuthActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
    isAuthenticated: true,
  })),

  // Signup failure: stop loading, show error
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  // Logout resets auth state back to initial
  on(AuthActions.logout, () => initialAuthState),

  // Clears any error message
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
