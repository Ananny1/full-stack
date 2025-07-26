import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  form: any;
  message = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize password reset form
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    });

    // Get token from query string (reset link)
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // Initialize animations
    AOS.init({ duration: 800, once: true });
  }

  submit() {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirm) {
      this.message = 'Passwords do not match';
      return;
    }

    this.loading = true;

    // Call API to reset password using token
    this.authService.resetPassword(this.token, this.form.value.password!)
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.loading = false;
          // Redirect to login after 2 seconds
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.message = 'Invalid or expired token';
          this.loading = false;
        }
      });
  }
}
