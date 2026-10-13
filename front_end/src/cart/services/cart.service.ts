import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from "../../models/product.model";
import { orderResponse, OrderService } from "./order.service";

const CART_STORAGE_KEY = "CartItems";

export interface CartItem extends Omit<Product, "uri"> {
  quantity: number;
}

@Injectable({ providedIn: "root" })
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItems.asObservable();

  constructor(private orderService: OrderService) {
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
      console.error("Failed to initialize cart: ", error);
      this.cartItems.next([]);
    }
  }

  // Save current cart state to localStorage
  private saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      this.cartItems.next(items);
    } catch (error) {
      console.error("Failed to save cart: ", error);
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
      item.id === productId ? { ...item, quantity: quantity } : item,
    );

    this.saveCart(updatedItems);
  }

  clearCart(): void {
    this.saveCart([]);
  }
  getTotal(): Observable<number> {
    return this.cart$.pipe(
      map((items) =>
        items.reduce((total, item) => total + item.price * item.quantity, 0),
      ),
    );
  }

  getItemCount(): Observable<number> {
    return this.cart$.pipe(
      map((items) => items.reduce((count, item) => count + 1, 0)),
    );
  }

  // Checks if product is in cart
  isInCart(productId: number): Observable<boolean> {
    return this.cart$.pipe(
      map((items) => items.some((item) => item.id === productId)),
    );
  }

  checkout(): Observable<{ order: orderResponse }> {
    const items: CartItem[] = this.cartItems.value;
    return this.orderService.createOrder(items);
  }
}
