import { Component } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { OrderItemsTableComponent } from "../components/order-items-table.component";
import {
  orderResponse,
  OrderService,
  PaymentMethodType,
} from "../services/order.service";

@Component({
  selector: "app-order",
  template: `
    <div class="container">
      @if (order$ | async; as order) {
        @if (order.items.length === 0) {
          <div class="empty-cart">
            <p>Oops, something went wrong;</p>
            <button mat-flat-button color="secondary" (click)="back()">
              Go Back
            </button>
          </div>
        } @else {
          <div class="order-container">
            <h1>Order Info</h1>

            <!-- Order status badge -->
            <div class="order-status" [ngClass]="'status-' + order.status">
              <mat-icon>
                {{ getStatusIcon(order.status) }}
              </mat-icon>
              <span>{{ order.status | titlecase }}</span>
            </div>

            <div class="cart-summary">
              @if (order.discount) {
                <p class="final">Subtotal: {{ order.subtotal | currency }}</p>
                <p class="discount">
                  Discount: {{ order.discount | currency }}
                </p>
              }
              <p class="total">Total: {{ order.total | currency }}</p>
              <p class="payment-method">
                Payment: {{ order.paymentMethod | titlecase }}
              </p>

              <div class="cart-actions">
                <button mat-flat-button color="secondary" (click)="back()">
                  Go Back
                </button>

                @if (order.status === "pending") {
                  <button
                    mat-flat-button
                    mat-stroked-button
                    color="primary"
                    (click)="checkout()"
                  >
                    Pay Now
                  </button>
                } @else if (order.status === "paid") {
                  <a href="/shop/products"
                    ><button mat-flat-button color="primary">
                      Continue Shopping
                    </button></a
                  >
                } @else {
                  <button mat-flat-button color="warn" (click)="checkout()">
                    Retry Payment
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="cart-container">
            <h1>Items</h1>
            <div class="cart-items">
              <app-order-items-table
                [items]="order.items"
              ></app-order-items-table>

              <div class="order-complete">
                <mat-icon color="primary">check_circle</mat-icon>
                <p>{{ getCompletionMessage(order.status) }}</p>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: row;
        padding: var(--spacing-xl);
        max-width: 800px;
        margin: 0 auto;
      }

      .order-container {
        flex: 1;
        padding: var(--spacing-md);
        max-width: 480px;
        margin: 0 auto;
      }

      .order-status {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        font-weight: 600;
        margin-bottom: var(--spacing-md);
      }

      .order-status.status-paid {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      .order-status.status-pending {
        background-color: #fff3e0;
        color: #ef6c00;
      }

      .order-status.status-failed {
        background-color: #ffebee;
        color: #c62828;
      }

      .discount {
        text-indent: 1rem;
        color: mediumvioletred;
      }
      .final {
        text-indent: 1rem;
        color: lightseagreen;
      }

      .cart-container {
        flex: 1;
        padding: var(--spacing-md);
        max-width: 480px;
        margin: 0 auto;
      }

      .empty-cart {
        text-align: center;
        padding: var(--spacing-xl);

        p {
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-600);
        }
      }

      .cart-items {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .cart-item {
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--color-white);
        border-radius: var(--radius-md);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        .item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .item-details {
          flex: 1;

          h3 {
            margin: 0 0 var(--spacing-xs);
            font-size: 1.1rem;
          }
          span {
            margin: 0 0 var(--spacing-xs);
            font-size: 0.7rem;
          }

          .price {
            color: var(--color-primary);
            font-weight: 600;
          }
        }
      }

      .cart-summary {
        margin-top: var(--spacing-lg);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-gray-200);

        .total {
          font-size: 1.25rem;
          font-weight: 600;
          text-align: right;
          margin-bottom: var(--spacing-md);
        }

        .payment-method {
          text-align: right;
          color: var(--color-gray-600);
          margin-bottom: var(--spacing-md);
        }

        .cart-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
        }
      }

      .coupon-field {
        flex: 1;
        font-size: x-large;
        font-weight: 600;
        min-width: 200px;
      }

      .payment-method-field {
        flex: 1;
        font-size: x-large;
        font-weight: 600;
        min-width: 200px;
      }

      .coupon-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--radius-md);
        font-size: 1rem;
      }

      .order-complete {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        background-color: #e8f5e9;
        border-radius: var(--radius-md);
        text-align: center;
        justify-content: center;

        mat-icon {
          font-size: 3rem;
          width: 3rem;
          height: 3rem;
        }

        p {
          font-size: 1.1rem;
          color: #2e7d32;
        }
      }

      table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
          padding: var(--spacing-sm);
          text-align: left;
          border-bottom: 1px solid var(--color-gray-200);
        }

        th {
          font-weight: 600;
          color: var(--color-gray-600);
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    OrderItemsTableComponent,
  ],
})
export class OrderComponent {
  order$: Observable<orderResponse>;
  orderId!: string;
  codeCoupon!: string;
  selectedPaymentMethod!: PaymentMethodType;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    const { orderId } = route.snapshot.queryParams;
    this.orderId = orderId;
    this.order$ = this.orderService.getOrder(this.orderId).pipe(
      map((data) => {
        const order = data.order;
        this.selectedPaymentMethod = order.paymentMethod as PaymentMethodType;
        return order;
      }),
    );
  }

  back() {
    this.location.back();
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "paid":
        return "check_circle";
      case "failed":
        return "cancel";
      default:
        return "schedule";
    }
  }

  getCompletionMessage(status: string): string {
    switch (status) {
      case "paid":
        return "Payment successful! Your order has been confirmed.";
      case "failed":
        return "Payment failed. Please try again or contact support.";
      default:
        return "Order is being processed.";
    }
  }

  checkout() {
    this.router.navigateByUrl(`/checkout?orderId=${this.orderId}`, {
      browserUrl: "/checkout",
    });
  }
}
