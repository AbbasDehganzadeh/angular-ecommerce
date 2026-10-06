import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "../../user/services/user.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-profile-view",
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <h1>User Profile</h1>
      </header>
      <main class="profile-card">
        @if (me$ | async; as me) {
          <div class="avatar-section">
            <img
              src="https://avatar.iran.liara.run/public"
              alt="User avatar"
              class="avatar-image"
              width="100"
              height="100"
            />
          </div>
          <div class="user-info">
            <h2 class="username">{{ me.username }}</h2>
            <p class="user-name" *ngIf="me.name">Name: {{ me.name }}</p>
            <p class="user-email">Email: {{ me.email }}</p>
          </div>
        } @else {
          <p class="no-user">No user data available</p>
        }
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: #fafafa;
      }

      .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 48px 24px;
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
      }

      .profile-header {
        margin-bottom: 32px;
        text-align: center;
      }

      .profile-header h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 500;
        color: #1a1a1a;
        letter-spacing: -0.02em;
      }

      .profile-card {
        width: 100%;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 40px 32px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }

      .avatar-section {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }

      .avatar-image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #f0f0f0;
      }

      .user-info {
        text-align: center;
      }

      .username {
        margin: 0 0 16px 0;
        font-size: 1.375rem;
        font-weight: 600;
        color: #1a1a1a;
        letter-spacing: -0.01em;
      }

      .user-name,
      .user-email {
        margin: 10px 0;
        font-size: 0.9375rem;
        color: #4a4a4a;
        line-height: 1.5;
      }

      .user-email {
        color: #666666;
        font-size: 0.875rem;
      }

      .no-user {
        margin: 0;
        color: #999999;
        font-size: 0.9375rem;
      }

      @media (max-width: 480px) {
        .profile-container {
          padding: 32px 16px;
        }

        .profile-card {
          padding: 32px 24px;
        }

        .profile-header h1 {
          font-size: 1.5rem;
        }

        .username {
          font-size: 1.25rem;
        }
      }
    `,
  ],
  imports: [CommonModule],
  standalone: true,
})
export class ProfileComponent {
  me$: Observable<User>;
  constructor(private userService: UserService) {
    this.me$ = this.userService.getUserDetail().pipe(map((data) => data.user));
  }
}
