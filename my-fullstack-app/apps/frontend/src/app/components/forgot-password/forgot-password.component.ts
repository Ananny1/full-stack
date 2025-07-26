import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  form: any;
  message = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    // Initialize the form with email field + validators
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Initialize animations
    AOS.init({ duration: 800, once: true });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    // Call API to request password reset email
    this.authService.forgotPassword(this.form.value.email!)
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.loading = false;
        },
        error: () => {
          this.message = 'Something went wrong';
          this.loading = false;
        }
      });
  }
}
