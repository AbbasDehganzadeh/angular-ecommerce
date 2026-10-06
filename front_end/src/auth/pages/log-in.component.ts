import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-login",
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Please log in to continue</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Email or Username</mat-label>
              <input
                matInput
                formControlName="identifier"
                type="text"
                autocomplete="username"
                [attr.aria-label]="'Email or Username'"
              />
              @if (
                loginForm.get("identifier")?.touched &&
                loginForm.get("identifier")?.invalid
              ) {
                <mat-error>Please enter your email or username</mat-error>
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
                autocomplete="current-password"
                [attr.aria-label]="'Password'"
              />
              <button
                type="button"
                class="visibility-toggle"
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="
                  hidePassword ? 'Show password' : 'Hide password'
                "
              >
                <i
                  class="fas"
                  [class.fa-eye]="hidePassword"
                  [class.fa-eye-slash]="!hidePassword"
                ></i>
              </button>
              @if (
                loginForm.get("password")?.touched &&
                loginForm.get("password")?.invalid
              ) {
                <mat-error>Please enter your password</mat-error>
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
            [disabled]="loginForm.invalid || isLoading"
          >
            Log In
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <a routerLink="/user/signup">Create one now</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./styles.scss"],
})
export class LogInComponent {
  loginForm: FormGroup;
  error = "";
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      identifier: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = "";

      const { identifier, password } = this.loginForm.value;
      this.authService.login(identifier, password).subscribe({
        next: () => {
          this.router.navigateByUrl("/user/profile");
        },
        error: (err) => {
          this.error =
            err instanceof Error
              ? err.message
              : "An error occurred during login";
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
