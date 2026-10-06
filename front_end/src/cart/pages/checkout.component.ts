import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { CartService, CartItem } from "../services/cart.service";
import { UserService } from "../../user/services/user.service";

@Component({
  selector: "app-checkout",
  template: `
    <div class="container">
      <div class="ckeckout-container">
        <h1>Checkout Info</h1>
        <div class="cart-summary">
          @if (discount$ | async) {
            <p class="discount">Discount: {{ discount$ | async | currency }}</p>
            <p class="final">Final: {{ final$ | async | currency }}</p>
          }
          <p class="total">Total: {{ total$ | async | currency }}</p>
          <div class="cart-actions">
            <button mat-flat-button color="secondary" (click)="back()">
              Go Back
            </button>
            <button
              mat-flat-button
              mat-stroked-button
              color="primary"
              (click)="checkout()"
            >
              Done!
            </button>
          </div>
        </div>
      </div>
      <div class="cart-container">
        <h1>Items</h1>
        @if (cart$ | async; as cartItems) {
          @if (cartItems.length === 0) {
            <div class="empty-cart">
              <p>Your cart is empty</p>
              <button
                mat-raised-button
                color="primary"
                routerLink="/shop/products"
              >
                Continue Shopping
              </button>
            </div>
          } @else {
            <div class="cart-items">
              <table>
                <thead>
                  <tr>
                    <th>quantity</th>
                    <th>item</th>
                    <th>price</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of cartItems; track item.id) {
                    <tr class="cart-item">
                      <td>
                        <span>{{ item.quantity }}</span>
                      </td>
                      <td>
                        <h3>{{ item.title }}</h3>
                      </td>
                      <td>
                        <p class="price">{{ item.price }}</p>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <!-- discount field -->
              <div class="discount-field">
                <label>Discount code</label>
                <input
                  matInput
                  type="text"
                  placeholder="Cooupn code ..."
                  [(ngModel)]="codeDiscount"
                  class="discount-input"
                />
                <button (click)="setDiscount()">Validate</button>
              </div>
            </div>
          }
        }
      </div>
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

      .discount-field {
        flex: 1;
        font-size: x-large;
        font-weight: 600;
        min-width: 200px;
      }

      .discount-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--radius-md);
        font-size: 1rem;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
})
export class CheckoutComponent {
  cart$: Observable<CartItem[]>;
  total$: Observable<number>;
  discount$: Observable<number>;
  final$: Observable<number>;
  codeDiscount: string;

  constructor(
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
  ) {
    this.cart$ = this.cartService.cart$;
    this.total$ = this.cartService.getTotal();
    this.discount$ = this.cartService.getDiscount();
    this.final$ = this.cartService.getFinal();
    this.codeDiscount = "";
  }

  back() {
    this.router.navigateByUrl("/cart");
  }

  isAuthenticated() {
    return this.userService.isAuthenticated();
  }

  setDiscount() {
    const code = this.codeDiscount;
    this.codeDiscount = "";
    this.cartService.setDiscount(code);
  }

  checkout() {
    this.cartService.clearCart();
    this.router.navigateByUrl("/");
  }
}
