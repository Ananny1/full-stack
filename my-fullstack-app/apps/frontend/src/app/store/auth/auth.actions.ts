import { createAction, props } from '@ngrx/store';
import { User } from './auth.state';

// Triggered when user tries to log in
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

// Dispatched when login API call succeeds
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

// Dispatched when login API call fails
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Triggered when user tries to sign up
export const signup = createAction(
  '[Auth] Signup',
  props<{ firstName: string; lastName: string; email: string; password: string }>()
);

// Dispatched when signup API call succeeds
export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ user: User; token: string }>()
);

// Dispatched when signup API call fails
export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: string }>()
);

// Clears user session and logs out
export const logout = createAction('[Auth] Logout');

// Loads user data if a token exists (e.g., page refresh)
export const loadUserFromToken = createAction('[Auth] Load User From Token');

// Clears any error messages in the auth state
export const clearError = createAction('[Auth] Clear Error');
