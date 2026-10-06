import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "../../models/user.model";
import {
  CookieService,
  USER_COOKIE_KEY,
} from "../../common/services/cookie.service";
// import * as argon2 from 'argon2';

@Injectable({ providedIn: "root" })
export class UserService {
  private readonly users: User[] = [
    { username: "john", email: "a@b.c", password: "1234" },
  ];
  private readonly API_URL = "http://localhost:3030/api/users";

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
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

  getCurrentUser(): User | null {
    const userData = this.cookieService.get(USER_COOKIE_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  getUserToken(): string {
    const userData = this.cookieService.get(USER_COOKIE_KEY);
    if (userData) {
      try {
        return JSON.parse(userData).token;
      } catch {
        return "";
      }
    }
    return "";
  }

  getUserDetail(): Observable<{ user: User }> {
    const token = this.getUserToken();
    return this.http.get<{ user: User }>(`${this.API_URL}/me`).pipe(
      tap((response) => console.log("fetching profile...", response)),
      catchError((error) => this.handleError(error)),
    );
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
