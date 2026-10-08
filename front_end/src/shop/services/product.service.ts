import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError, of, timer } from "rxjs";
import {
  catchError,
  retryWhen,
  tap,
  mergeMap,
  take,
  map,
} from "rxjs/operators";
import { Product } from "../../models/product.model";

export type sortingKey = "rating" | "count" | "price" | "alphabet" | "time";
export type sortingType = `${sortingKey}` | `~${sortingKey}`;

export type productQueryType = {
  search?: string;
  min?: number;
  max?: number;
  sort?: sortingType;
  category?: string;
  limit?: number;
  offset?: number;
};

@Injectable({ providedIn: "root" })
export class ProductService {
  private readonly API_URL = "http://localhost:3030/api/products";
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  private readonly RECENT_PRODUCTS_KEY = "recentProducts";
  private readonly MAX_RECENT_PRODUCTS = 5;

  // Fallback data in case the API fails
  private readonly fallbackCategories: string[] = ["sports", "office"];
  private readonly fallbackProducts: Product[] = [
    {
      id: 1,
      title: "skate-board",
      category: "sports",
      uri: "https://picsum.photos/seed/angular/100",
      price: 360000,
      description: "",
      rating: {
        rate: 0,
        count: 0,
      },
    },
    {
      id: 2,
      title: "wood-desk",
      category: "office",
      uri: "https://picsum.photos/seed/250/100",
      price: 360000,
      description: "",
      rating: {
        rate: 0,
        count: 0,
      },
    },
    {
      id: 3,
      title: "mount-bike",
      category: "sports",
      uri: "https://picsum.photos/seed/Cool/100",
      price: 360000,
      description: "",
      rating: {
        rate: 0,
        count: 0,
      },
    },
  ];

  constructor(private http: HttpClient) {}

  private retryStrategy() {
    retryWhen((errors) =>
      errors.pipe(
        mergeMap((error, index) => {
          const retryAttempt = index + 1;
          if (retryAttempt > this.maxRetries) {
            return throwError(() => error);
          }
          console.log(`Retry attempt ${retryAttempt}/${this.maxRetries}`);
          return timer(retryAttempt * this.retryDelay);
        }),
      ),
    );
  }

  private handleError(error: HttpErrorResponse, fallback: any = []) {
    let errorMessage = "An unknown error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error("API Error:", errorMessage);
    return of(fallback);
  }

  getProducts(
    query: productQueryType = {},
  ): Observable<{ products: Product[]; productsCount: number }> {
    let search = "?";
    const iter = Object.entries(query);
    iter.forEach(([k, w], i) => (search += `${k}=${w}&`));
    search = search.slice(0, -1);
    return this.http
      .get<{ products: Product[]; productsCount: number }>(
        `${this.API_URL}${search}`,
      )
      .pipe(
        tap((response) => console.log("Fetching products...", response)),
        tap(() => this.retryStrategy()),
        catchError((error) => this.handleError(error, this.fallbackProducts)),
      );
  }

  getProduct(id: string): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(`${this.API_URL}/${id}`).pipe(
      tap(() => console.log(`Fetching product ${id}...`)),
      tap(() => this.retryStrategy()),
      catchError((error) => this.handleError(error, this.fallbackProducts[0])),
    );
  }

  getProductsByCategory(
    category: string,
  ): Observable<{ products: Product[]; productsCount: number }> {
    if (category === "loading" || category === "unknown") {
      return of({ products: this.fallbackProducts, productsCount: 0 });
    }

    return this.http
      .get<{ products: Product[]; productsCount: number }>(
        `${this.API_URL}/category/${category}`,
      )
      .pipe(
        tap((response) => console.log(`Fetching products in category ${category}...`, response)),
        tap(() => this.retryStrategy()),
        catchError((error) => this.handleError(error, this.fallbackProducts)),
      );
  }

  getCategories(): Observable<{ categories: string[] }> {
    return this.http
      .get<{ categories: string[] }>(`${this.API_URL}/categories`)
      .pipe(
        tap((response) => console.log("Fetching categories...", response)),
        tap(() => this.retryStrategy()),
        catchError((error) => this.handleError(error, this.fallbackCategories)),
      );
  }

  addToRecentProducts(product: Product): void {
    try {
      let recentProducts = this.getRecentProducts();
      recentProducts = recentProducts.filter((p) => p.id !== product.id);
      recentProducts.unshift(product);

      if (recentProducts.length > this.MAX_RECENT_PRODUCTS) {
        recentProducts = recentProducts.slice(0, this.MAX_RECENT_PRODUCTS);
      }

      localStorage.setItem(
        this.RECENT_PRODUCTS_KEY,
        JSON.stringify(recentProducts),
      );
    } catch (error) {
      console.error("Error saving recent products:", error);
    }
  }

  getRecentProducts(): Product[] {
    try {
      const products = localStorage.getItem(this.RECENT_PRODUCTS_KEY);
      return products ? JSON.parse(products) : [];
    } catch (error) {
      console.error("Error retrieving recent products:", error);
      return [];
    }
  }
}
