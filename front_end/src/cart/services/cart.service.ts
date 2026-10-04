import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product.model';

const CART_STORAGE_KEY = 'CartItems';

export interface CartItem extends Omit<Product, 'uri'> {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private discount = new BehaviorSubject<number>(0);
  discountPercent$ = this.discount.asObservable();
  cart$ = this.cartItems.asObservable();

  constructor() {
    this.initializeCart();
  }

  // Initialize cart from localStorage
  private initializeCart(): void {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const items = JSON.parse(savedCart) as CartItem[];
        this.cartItems.next(items);
      }
    } catch (error) {
      console.error('Failed to initialize cart: ', error);
      this.cartItems.next([]);
    }
  }

  // Save current cart state to localStorage
  private saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      this.cartItems.next(items);
    } catch (error) {
      console.error('Failed to save cart: ', error);
    }
  }

  addItem(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (!existingItem) {
      const newItem: CartItem = {
        ...product,
        quantity,
      };
      this.saveCart([...currentItems, newItem]);
    }
  }

  removeItem(productId: number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter((item) => item.id !== productId);
    this.saveCart(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 0) return;

    if (quantity == 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.map((item) =>
      item.id === productId ? { ...item, quantity: quantity } : item
    );

    this.saveCart(updatedItems);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  private validateDiscount(code: string): [number, boolean] {
    const cooupns = new Map([
      ['ROCK', 10],
      ['HALF', 50],
      ['COOL', 70],
    ]);
    const rawCode = code.toUpperCase();
    for (const [c, d] of cooupns) {
      if (rawCode.includes(c)) {
        return [d, true];
      }
    }
    return [0, false];
  }

  setDiscount(code: string) {
    const [newdiscount, ok] = this.validateDiscount(code);
    if (ok) {
      this.discount.next(newdiscount);
      return;
    }
    const discount = this.discount.value;
    if (newdiscount < 0 || newdiscount >= 100) {
      this.discount.next(discount);
      return;
    }
    this.discount.next(discount);
  }

  getTotal(): Observable<number> {
    return this.cart$.pipe(
      map((items) =>
        items.reduce((total, item) => total + item.price * item.quantity, 0)
      )
    );
  }

  getFinal(): Observable<number> {
    return combineLatest([this.getTotal(), this.getDiscount()]).pipe(
      map(([price, discount]) => price - discount)
    );
  }

  getDiscount(): Observable<number> {
    return combineLatest([this.getTotal(), this.discountPercent$]).pipe(
      map(([price, discount]) => price * (discount / 100))
    );
  }

  getItemCount(): Observable<number> {
    return this.cart$.pipe(
      map((items) => items.reduce((count, item) => count + 1, 0))
    );
  }

  // Checks if product is in cart
  isInCart(productId: number): Observable<boolean> {
    return this.cart$.pipe(
      map((items) => items.some((item) => item.id === productId))
    );
  }
}
