import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join us and start shopping</p>
        </div>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input 
                matInput 
                formControlName="username"
                type="text"
                autocomplete="username"
                [attr.aria-label]="'Username'"
              >
              @if (signupForm.get('username')?.touched && signupForm.get('username')?.invalid) {
                <mat-error>
                  @if (signupForm.get('username')?.errors?.['required']) {
                    Username is required
                  }
                  @if (signupForm.get('username')?.errors?.['minlength']) {
                    Username must be at least 3 characters
                  }
                </mat-error>
              }
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input 
                matInput 
                formControlName="name"
                type="text"
                autocomplete="name"
                [attr.aria-label]="'Full Name'"
              >
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input 
                matInput 
                formControlName="email"
                type="email"
                autocomplete="email"
                [attr.aria-label]="'Email'"
              >
              @if (signupForm.get('email')?.touched && signupForm.get('email')?.invalid) {
                <mat-error>
                  @if (signupForm.get('email')?.errors?.['required']) {
                    Email is required
                  }
                  @if (signupForm.get('email')?.errors?.['email']) {
                    Please enter a valid email address
                  }
                </mat-error>
              }
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input 
                matInput 
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                autocomplete="new-password"
                [attr.aria-label]="'Password'"
              >
              <button 
                type="button"
                class="visibility-toggle"
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="hidePassword ? 'Show password' : 'Hide password'"
              >
                <i class="fas" [class.fa-eye]="hidePassword" [class.fa-eye-slash]="!hidePassword"></i>
              </button>
              @if (signupForm.get('password')?.touched && signupForm.get('password')?.invalid) {
                <mat-error>
                  @if (signupForm.get('password')?.errors?.['required']) {
                    Password is required
                  }
                  @if (signupForm.get('password')?.errors?.['minlength']) {
                    Password must be at least 6 characters
                  }
                </mat-error>
              }
            </mat-form-field>
          </div>

          @if (error) {
            <div class="error-message" role="alert">
              <i class="fas fa-exclamation-circle"></i>
              {{ error }}
            </div>
          }

          <button 
            type="submit" 
            class="submit-button" 
            [class.loading]="isLoading"
            [disabled]="signupForm.invalid || isLoading"
          >
            Create Account
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account? 
            <a routerLink="/user/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./styles.scss'],
})
export class SignUpComponent {
  signupForm: FormGroup;
  error = '';
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.error = '';

      try {
        this.authService.signUp(this.signupForm.value);
        this.router.navigateByUrl('/shop/products');
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : 'An error occurred during signup';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
