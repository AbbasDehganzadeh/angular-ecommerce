import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
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
  selector: "app-checkout",
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
          <div class="ckeckout-container">
            <h1>Checkout Info</h1>
            <div class="cart-summary">
              @if (order.discount) {
                <p class="final">Subtotal: {{ order.subtotal | currency }}</p>
                <p class="discount">
                  Discount: {{ order.discount | currency }}
                </p>
              }
              <p class="total">Total: {{ order.total | currency }}</p>
              <div class="cart-actions">
                <button mat-flat-button color="secondary" (click)="back()">
                  Go Back
                </button>
                <button
                  mat-flat-button
                  mat-stroked-button
                  color="primary"
                  (click)="pay()"
                >
                  Done!
                </button>
              </div>
            </div>
          </div>

          <div class="cart-container">
            <h1>Items</h1>
            <div class="cart-items">
              <app-order-items-table
                [items]="order.items"
              ></app-order-items-table>

              <!-- coupon field -->
              <div class="coupon-field">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Coupon code</mat-label>
                  <input
                    matInput
                    type="text"
                    placeholder="Enter coupon code..."
                    [(ngModel)]="codeCoupon"
                    class="coupon-input"
                  />
                </mat-form-field>
                <button
                  mat-raised-button
                  color="primary"
                  (click)="setDiscount()"
                >
                  Validate
                </button>
              </div>

              <!-- payment method field -->
              <div class="payment-method-field">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Payment method</mat-label>
                  <mat-select
                    [(ngModel)]="selectedPaymentMethod"
                    (selectionChange)="changePaymentMethod()"
                  >
                    <mat-option value="credit">In-App Credit</mat-option>
                    <mat-option value="card">Credit Card</mat-option>
                    <mat-option value="cash">Cash on Delivery</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>credit_card</mat-icon>
                </mat-form-field>
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

      .checkout-container {
        flex: 1;
        padding: var(--spacing-md);
        max-width: 480px;
        margin: 0 auto;
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
export class CheckoutComponent {
  order$: Observable<orderResponse>;
  orderId!: string;
  codeCoupon!: string;
  selectedPaymentMethod!: PaymentMethodType;
  amount!: number;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const { orderId } = route.snapshot.queryParams;
    this.orderId = orderId;
    this.order$ = this.getOrder();
  }

  getOrder() {
    return this.orderService.getOrder(this.orderId).pipe(
      map((data) => {
        const order = data.order;
        this.selectedPaymentMethod = order.paymentMethod as PaymentMethodType;
        this.amount = order.total;
        return order;
      }),
    );
  }

  back() {
    this.router.navigateByUrl("/cart");
  }

  setDiscount() {
    const code = this.codeCoupon?.trim();
    if (!code) return;
    this.orderService.setDiscount(this.orderId, code).subscribe({
      next: (res) => {
        this.codeCoupon = "";
        // Refresh order with updated totals
        this.order$ = this.getOrder();
      },
      error: (err) => {
        console.error({ coupon: err });
      },
    });
  }

  changePaymentMethod() {
    if (!this.selectedPaymentMethod) return;
    this.orderService
      .setPaymentMethod(this.orderId, this.selectedPaymentMethod)
      .subscribe({
        next: (res) => {
          this.order$ = this.getOrder();
        },
        error: (err) => {
          console.error({ paymentMethod: err });
        },
      });
  }

  pay() {
    this.orderService
      .pay(this.orderId, this.selectedPaymentMethod, this.amount)
      .subscribe({
        next: (res) => {
          // Navigate to order page to show confirmation
          this.router.navigateByUrl(`/order?orderId=${this.orderId}`);
        },
        error: (err) => {
          console.error({ checkout: err });
        },
      });
  }
}
