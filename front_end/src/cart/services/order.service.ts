import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { Product } from "../../models/product.model";
import { CartItem } from "./cart.service";

export interface OrderItem extends Omit<Product, "uri"> {
  quantity: number;
}
export type PaymentMethodType = "card" | "cash" | "credit";
export type StatusType = "pending" | "paid" | "failed";
export type orderResponseType = {
  id: string;
  tag: string;
  status: StatusType;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethodType;
  createdAt: string;
};

export type ordersResponse = orderResponseType[];
export type orderResponse = orderResponseType & { items: OrderItem[] };
export type CouponResponse = {
  code: string;
  percent: number;
  discount: number;
  total: number;
};

@Injectable({ providedIn: "root" })
export class OrderService {
  private readonly API_URL = "http://localhost:3030/api";

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error("API Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getOrders(): Observable<{ orders: ordersResponse }> {
    return this.http
      .get<{ orders: ordersResponse }>(`${this.API_URL}/orders`)
      .pipe(
        tap((response) => {
          console.log("fetching orders...", response);
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  getOrder(id: string): Observable<{ order: orderResponse }> {
    return this.http
      .get<{ order: orderResponse }>(`${this.API_URL}/orders/${id}`)
      .pipe(
        tap((response) => {
          console.log("fetching order...", response);
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  createOrder(items: CartItem[]): Observable<{ order: orderResponse }> {
    const body = {
      items: items.map((p) => ({ id: p.id, quantity: p.quantity })),
    };
    return this.http
      .post<{ order: orderResponse }>(`${this.API_URL}/orders`, body)
      .pipe(
        tap((response) => {
          console.log("checking out...", response);
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  setDiscount(orderId: string, code: string): Observable<CouponResponse> {
    return this.http
      .post<CouponResponse>(`${this.API_URL}/coupons/validate`, {
        orderId,
        code,
      })
      .pipe(
        tap((response) => {
          console.log("validating coupon...", response);
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  setPaymentMethod(
    orderId: string,
    method: PaymentMethodType,
  ): Observable<{ order: orderResponse }> {
    return this.http
      .post<{ order: orderResponse }>(`${this.API_URL}/payment/change`, {
        orderId,
        paymentMethod: method,
      })
      .pipe(
        tap((response) => {
          console.log("changing payment method...", response);
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  pay(
    id: string,
    method: PaymentMethodType,
    amount: number,
  ): Observable<{ order: orderResponse }> {
    return this.http
      .post<{ order: orderResponse }>(`${this.API_URL}/orders/${id}/pay`, {
        paymentMethod: method,
        amount,
        card: { number: "000000000000" },
      })
      .pipe(
        tap((response) => {
          console.log("paying order...", response);
        }),
        catchError((error) => this.handleError(error)),
      );
  }
}
