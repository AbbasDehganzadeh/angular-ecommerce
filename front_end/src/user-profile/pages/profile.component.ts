import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { CurrencyPipe } from "@angular/common";
import { UserService } from "../../user/services/user.service";
import { User } from "../../models/user.model";
import {
  OrderService,
  ordersResponse,
} from "../../cart/services/order.service";

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

        <!-- Orders section -->
        <section class="orders-section">
          <h2>My Orders</h2>
          @if (orders$ | async; as orders) {
            @if (orders.length === 0) {
              <p class="no-orders">No orders yet</p>
            } @else {
              <table
                mat-table
                [dataSource]="orders"
                class="mat-elevation-z1 orders-table"
              >
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>Order #</th>
                  <td mat-cell *matCellDef="let order">
                    <a
                      [routerLink]="['/cart/order']"
                      [queryParams]="{ orderId: order.id }"
                      class="order-link"
                    >
                      {{ order.tag }}
                    </a>
                  </td>
                </ng-container>
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date</th>
                  <td mat-cell *matCellDef="let order">
                    {{ order.createdAt | date: "shortDate" }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let order">
                    <mat-chip
                      [color]="getStatusColor(order.status)"
                      class="status-chip"
                    >
                      {{ order.status | titlecase }}
                    </mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="total">
                  <th mat-header-cell *matHeaderCellDef>Total</th>
                  <td mat-cell *matCellDef="let order">
                    {{ order.total | currency }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="paymentMethod">
                  <th mat-header-cell *matHeaderCellDef>Payment</th>
                  <td mat-cell *matCellDef="let order">
                    {{ order.paymentMethod | titlecase }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let order">
                    <a
                      [routerLink]="['/cart/order']"
                      [queryParams]="{ orderId: order.id }"
                      mat-stroked-button
                      color="primary"
                    >
                      <mat-icon>visibility</mat-icon> View
                    </a>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                ></tr>
              </table>
            }
          }
        </section>
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
        max-width: 900px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
      }

      .profile-header {
        margin-bottom: 32px;
        text-align: center;
        width: 100%;
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
        margin-bottom: 32px;
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

      .orders-section {
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid #e5e5e5;
      }

      .orders-section h2 {
        margin: 0 0 20px 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a1a1a;
      }

      .no-orders {
        text-align: center;
        color: #999999;
        padding: 24px;
      }

      .orders-table {
        width: 100%;
      }

      .order-link {
        color: #1976d2;
        text-decoration: none;
        font-weight: 500;
      }

      .order-link:hover {
        text-decoration: underline;
      }

      .status-chip {
        font-size: 0.75rem;
        height: 24px;
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
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    CurrencyPipe,
  ],
  standalone: true,
})
export class ProfileComponent {
  me$: Observable<User>;
  orders$: Observable<ordersResponse>;
  displayedColumns = [
    "id",
    "date",
    "status",
    "total",
    "paymentMethod",
    "actions",
  ];

  constructor(
    private userService: UserService,
    private orderService: OrderService,
  ) {
    this.me$ = this.userService.getUserDetail().pipe(map((data) => data.user));
    this.orders$ = this.orderService
      .getOrders()
      .pipe(map((data) => data.orders));
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "paid":
        return "primary";
      case "failed":
        return "warn";
      default:
        return "accent";
    }
  }
}
