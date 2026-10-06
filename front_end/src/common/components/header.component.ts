import { Component, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { MatBadgeModule } from "@angular/material/badge";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { CartService } from "../../cart/services/cart.service";
import { UserService } from "../../user/services/user.service";
import { Subscription } from "rxjs";
import { User } from "../../models/user.model";

@Component({
  selector: "app-header",
  standalone: true,
  template: `
    <div class="header" role="header">
      <img
        width="40"
        alt="Angular Logo"
        title="Ecommerce"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
      />
      @if (isAuthenticated()) {
        <span>Welcome </span> {{ currentUser?.username }}
      }
      <div class="spacer"></div>
      <mat-toolbar-row>
        <a [routerLink]="['']" routerLinkActive="active-link" class="outLink"
          ><span>Home</span></a
        >
        <a
          [routerLink]="['/shop', 'products']"
          routerLinkActive="active-link"
          [routerLinkActiveOptions]="{ exact: false }"
          class="outLink"
          ><span>Products</span></a
        >
        <a
          [routerLink]="['/shop', 'categories']"
          routerLinkActive="active-link"
          [routerLinkActiveOptions]="{ exact: false }"
          class="outLink"
          ><span>Categories</span></a
        >
      </mat-toolbar-row>
      <div class="spacer"></div>
      <a
        [routerLink]="['/cart']"
        routerLinkActive="active"
        id="cart-logo"
        class="not-anchor"
        ><i
          [matBadge]="itemCount"
          matBadgeSize="small"
          class="fas fa-cart-shopping"
        ></i
      ></a>

      <i
        [matMenuTriggerFor]="usermenu"
        class="fas fa-user"
        aria-label="User Profile"
        title="User"
      ></i>
      <mat-menu #usermenu="matMenu">
        @if (!isAuthenticated()) {
          <a
            [routerLink]="['/user', 'signup']"
            routerLinkActive="active"
            class="not-anchor"
          >
            <button mat-menu-item>Sign Up</button></a
          >
          <a
            [routerLink]="['/user', 'login']"
            routerLinkActive="active"
            class="not-anchor"
          >
            <button mat-menu-item>Log In</button></a
          >
        }
        @if (isAuthenticated()) {
          <a
            [routerLink]="['/user', 'profile']"
            routerLinkActive="active"
            class="not-anchor"
          >
            <button mat-menu-item>Profile</button></a
          >
          <a
            [routerLink]="['/user', 'logout']"
            routerLinkActive="active"
            class="not-anchor"
          >
            <button mat-menu-item>Log Out</button></a
          >
        }
      </mat-menu>
    </div>
  `,
  styles: [
    `
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 2.5rem;
        display: flex;
        z-index: 1000;
        align-items: center;
        background-color: deepskyblue;
        color: snow;
        font-weight: 600;
      }

      .header img {
        margin: 0 6px;
        height: 25px;
        width: 25px;
      }

      .header #cart-logo {
        margin: auto var(--spacing-sm);
        color: #000000;
      }

      .active-link {
        cursor: text;
        text-decoration: none;
        color: #f5f5f5;
      }

      .outLink {
        padding: 0.5rem;
        color: limegreen;
      }

      .spacer {
        flex: 1;
      }

      i {
        text-align: center;
        vertical-align: middle;
        position: relative;
      }
    `,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    MatBadgeModule,
    MatMenu,
    MatMenuTrigger,
    MatToolbarModule,
  ],
})
export class HeaderComponent implements OnDestroy {
  itemCountSubscribe: Subscription;
  currentUser: User | null = null;
  itemCount = "0";
  constructor(
    private cartService: CartService,
    private userService: UserService,
  ) {
    this.currentUser = this.userService.getCurrentUser();
    this.itemCountSubscribe = this.cartService
      .getItemCount()
      .subscribe((data) => {
        this.itemCount = data.toString();
      });
  }
  isAuthenticated() {
    return this.userService.isAuthenticated();
  }

  ngOnDestroy() {
    this.itemCountSubscribe.unsubscribe();
  }
}
