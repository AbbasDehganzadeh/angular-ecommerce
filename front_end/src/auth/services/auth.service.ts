import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import {
  CookieService,
  USER_COOKIE_KEY,
} from "../../common/services/cookie.service";
import { User } from "../../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly API_URL = "http://localhost:3030/api/auth";

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

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

  signup(user: User): Observable<{ user: User; token: string }> {
    return this.http
      .post<{ user: User; token: string }>(`${this.API_URL}/signup`, user)
      .pipe(
        tap((response) => {
          console.log("signing up...", response);
          this.setSession(response.user, response.token);
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  login(
    identifier: string,
    password: string,
  ): Observable<{ user: User; token: string }> {
    return this.http
      .post<{ user: User; token: string }>(`${this.API_URL}/login`, {
        identifier,
        password,
      })
      .pipe(
        tap((response) => {
          console.log("logging in...", response);
          this.setSession(response.user, response.token);
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
      tap(() => {
        console.log("logging out...");
        this.clearSession();
      }),
      catchError((error) => {
        this.clearSession();
        return this.handleError(error);
      }),
    );
  }

  private setSession(user: User, token: string): void {
    const userData = { ...user, token };
    this.cookieService.set(USER_COOKIE_KEY, JSON.stringify(userData), 7);
  }

  private clearSession(): void {
    this.cookieService.delete(USER_COOKIE_KEY);
  }
}
