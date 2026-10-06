import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-logout",
  template: `
    <div>
      <p>Do you want to<b> exit! </b></p>
      <button mat-button (click)="logout()">log out</button>
    </div>
  `,
})
export class LogOutComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl("/");
      },
      error: (err) => {
        console.error("Logout error:", err);
        this.router.navigateByUrl("/");
      },
    });
  }
}
