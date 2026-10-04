import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../services/cart.service';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>

      @if (cart$ | async; as cartItems) {
        @if (cartItems.length === 0) {
          <div class="empty-cart">
            <p>Your cart is empty</p>
            <button mat-raised-button color="primary" routerLink="/shop/products">
              Continue Shopping
            </button>
          </div>
        } @else {
          <div class="cart-items">
            @for (item of cartItems; track item.id) {
              <div class="cart-item">
              <a [routerLink]="['/shop', 'product', item.id]" class="not-anchor">
                <div class="item-details">
                  <h3>{{ item.title }}</h3>
                  <p class="price">{{ item.price }}</p>
                </div>
            </a>
	    <div class="spacer"></div>
                <div class="quantity-controls">
                  <div (click)="updateQuantity(item.id, item.quantity - 1)">
                  <i class="fa-solid fa-minus"></i>
            </div>
                  <span class="quantity">{{ item.quantity }}</span>
                  <div (click)="updateQuantity(item.id, item.quantity + 1)">
                  <i class="fa-solid fa-plus"></i>
            </div>
                </div>
                <div color="warn" (click)="removeItem(item.id)">
                <i class="fa-solid fa-trash"></i>
            </div>
              </div>
            }
            <div class="cart-summary">
              <p class="total">Total: {{ total$ | async | currency }}</p>
              <div class="cart-actions">
                <button mat-stroked-button (click)="clearCart()">Clear Cart</button>
              @if (isAuthenticated()) {
                <a routerLink="/checkout"><button mat-raised-button color="primary">Checkout</button></a>
              } 
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
    .cart-container {
      padding: var(--spacing-lg);
      max-width: 800px;
      margin: 0 auto;
    }

    .spacer {
	flex: 1;
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
      gap: var(--spacing-xs);
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--color-white);
      border-radius: var(--radius-sm);
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

        .price {
          color: var(--color-primary);
          font-weight: 600;
        }
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);

        .quantity {
          min-width: 2rem;
          text-align: center;
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
  `,
  ],
})
export class CartComponent {
  cart$: Observable<CartItem[]>;
  total$: Observable<number>;

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {
    this.cart$ = this.cartService.cart$;
    this.total$ = this.cartService.getTotal();
  }

  isAuthenticated() {
    return this.userService.isAuthenticated();
  }

  removeItem(productId: number): void {
    const confirm = this.confirmRemove();
    if (!confirm) return;
    this.cartService.removeItem(productId);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity === 0) {
      const confirm = this.confirmRemove();
      if (!confirm) return;
    }
    this.cartService.updateQuantity(productId, quantity);
  }

  confirmRemove() {
    return confirm('Do you wanna delete this prduct');
  }

  clearCart(): void {
    const confirm = this.confirmRemove();
    if (!confirm) return;
    this.cartService.clearCart();
  }
}
