import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Expected response format when user logs in
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Expected response format when user signs up
export interface SignupResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base API URL (can be overridden in environment)
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Request password reset email
  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/auth/forgot-password`,
      { email }
    );
  }

  // Reset password using token from email link
  resetPassword(token: string, password: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/auth/reset-password`,
      { token, password }
    );
  }

  // Log user in, returns token + user info
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    });
  }

  // Create a new user account
  signup(firstName: string, lastName: string, email: string, password: string): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/auth/signup`, {
      firstName,
      lastName,
      email,
      password
    });
  }

  // Server-side logout (optional)
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  // Fetch current logged-in user profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  // Check if token exists and is not expired
  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    return !!token && !!expiry && Date.now() < parseInt(expiry);
  }

  // Get stored JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Clear token and expiry from local storage
  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
  }
}
