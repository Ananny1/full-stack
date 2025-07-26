import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'MEAN Stack Auth App';

  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isTokenValid()) {
      this.store.dispatch(AuthActions.loadUserFromToken());
    }
  }
}