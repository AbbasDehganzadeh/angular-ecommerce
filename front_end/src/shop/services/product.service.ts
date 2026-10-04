import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, of, timer } from 'rxjs';
import {
  catchError,
  retryWhen,
  tap,
  mergeMap,
} from 'rxjs/operators';
import { Product } from '../../models/product.model';

export type sortingKey = 'rating' | 'count' | 'price' | 'alphabet';
export type sortingType = `${sortingKey}` | `~${sortingKey}`;

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API_URL = 'https://fakestoreapi.com/products';
  private readonly headers = new HttpHeaders().set(
    'Accept',
    'application/json'
  );
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  private readonly RECENT_PRODUCTS_KEY = 'recentProducts';
  private readonly MAX_RECENT_PRODUCTS = 5;

  // Fallback data in case the API fails
  private readonly fallbackProducts: Product[] = [
    {
      id: 1,
      title: 'Sample Product',
      description: 'This is a fallback product when the API is unavailable',
      price: 99.99,
      category: 'sample',
      uri: 'https://picsum.photos/seed/1/400',
      rating: { rate: 4.5, count: 10 },
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
        })
      )
    );
  }

  private handleError(error: HttpErrorResponse, fallback: any = []) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error('API Error:', errorMessage);
    return of(fallback);
  }

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.API_URL, { headers: this.headers })
      .pipe(
        tap(() => console.log('Fetching products...')),
        tap(() => this.retryStrategy()),
        catchError((error) => this.handleError(error, this.fallbackProducts))
      );
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.API_URL}/${id}`, { headers: this.headers })
      .pipe(
        tap(() => console.log(`Fetching product ${id}...`)),
        tap(() => this.retryStrategy()),
        catchError((error) => this.handleError(error, this.fallbackProducts[0]))
      );
  }

  getProductByCategory(category: string): Observable<Product[]> {
    if (category === 'loading' || category === 'unknown') {
      return of(this.fallbackProducts);
    }

    return this.http
      .get<Product[]>(`${this.API_URL}/category/${category}`, {
        headers: this.headers,
      })
      .pipe(
        tap(() => console.log(`Fetching products in category ${category}...`)),
        tap(() => this.retryStrategy()),
        catchError((error) => this.handleError(error, this.fallbackProducts))
      );
  }

  getCategories(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.API_URL}/categories`, { headers: this.headers })
      .pipe(
        tap(() => console.log('Fetching categories...')),
        tap(() => this.retryStrategy()),
        catchError((error) => this.handleError(error, ['sample']))
      );
  }

  sortProducts(products: Product[], value: sortingType) {
    if (!products || products.length === 0) return [];

    if (value == 'rating') {
      return products.toSorted((a, b) => b.rating.rate - a.rating.rate);
    } else if (value == 'price') {
      return products.toSorted((a, b) => b.price - a.price);
    } else if (value == '~price') {
      return products.toSorted((a, b) => a.price - b.price);
    }
    return products.toSorted(
      (a, b) =>
        a.title.toLocaleLowerCase().charCodeAt(0) -
        b.title.toLocaleLowerCase().charCodeAt(0)
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
        JSON.stringify(recentProducts)
      );
    } catch (error) {
      console.error('Error saving recent products:', error);
    }
  }

  getRecentProducts(): Product[] {
    try {
      const products = localStorage.getItem(this.RECENT_PRODUCTS_KEY);
      return products ? JSON.parse(products) : [];
    } catch (error) {
      console.error('Error retrieving recent products:', error);
      return [];
    }
  }
}
