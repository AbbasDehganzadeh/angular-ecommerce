import { Injectable } from "@angular/core";
import {
  CookieService,
  USER_COOKIE_KEY,
} from "../../common/services/cookie.service";
import { UserService } from "../../user/services/user.service";
import { User } from "../../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(
    private userService: UserService,
    private cookieService: CookieService,
  ) {}

  signUp(user: User) {
    this.userService.createUser(user);
    this.authenticate(user, user.password);
  }

  logIn(identifier: string, password: string) {
    const username = this.userService.getUserName(identifier);
    const user = this.userService.getUser(username);
    if (!user) {
      throw new Error("User not found!");
    }

    this.authenticate(user, password);
  }

  logOut() {
    this.cookieService.delete(USER_COOKIE_KEY);
  }

  authenticate(user: User, password: string) {
    if (!this.userService.validatePassword(user.password, password)) {
      throw new Error("Password is incorrect!");
    }
    this.cookieService.set(USER_COOKIE_KEY, user.username);
  }
}
