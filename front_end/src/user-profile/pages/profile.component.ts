import { Component } from "@angular/core";
import { UserService } from "../../user/services/user.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-profile-view",
  template: `
    <h1>User profile</h1>
    <div class="profile-section">
      <div class="hero-section">
        <img
          src="https://avatar.iran.liara.run/public"
          class="hero-image"
          width="200"
          height="200"
        />
      </div>
      <h3>{{ me.username }}</h3>
      <p>Name: {{ me.name }}</p>
      <p>User Name: {{ me.username }}</p>
      <p>Email: {{ me.email }}</p>
      @if (me.email1) {
        <p>Email: {{ me.email1 }}</p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: var(--spacing-lg);
      }
      .profile-section {
        width: 100vw;
        height: 100vh;
        max-width: 480px;
        max-height: 800px;
      }
      .hero-section {
        width: 100%;
      }
      .hero-image {
        border-radius: 50%;
        aspect-ratio: 1/1;
        max-width: 200px;
      }
    `,
  ],
  standalone: true,
})
export class ProfileComponent {
  me: User;
  constructor(private user: UserService) {
    this.me = this.user.getUserDetails() as User;
  }
}
