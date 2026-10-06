import { Injectable, inject } from "@angular/core";
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { UserService } from "../../user/services/user.service";

export function JwtInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const token = inject(UserService).getUserToken();
  req = req.clone({
    setHeaders: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return next(req);
}
