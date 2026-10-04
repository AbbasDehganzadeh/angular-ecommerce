import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { CookieService, USER_COOKIE_KEY } from '../../common/services/cookie.service';
// import * as argon2 from 'argon2';

@Injectable({ providedIn: 'root' })
export class UserService {
  users: User[] = [{ username: 'john', email: 'a@b.c', password: '1234' }];

  constructor(private cookieService: CookieService) {}

  getUserName(value: string) {
    const user = this.users.find(
      (user) =>
        user.username === value || user.email === value || user.email1 === value
    );
    return user?.username || '';
  }

  getUser(name: string) {
    return this.users.find((user) => user.username === name && name !== '');
  }

  getUserByName(name: string) {
    return this.users.find((user) => user.username == name);
  }

  getUserByEmail(email: string) {
    return this.users.find(
      (user) => user.email == email || user.email1 == email
    );
  }

  getUserDetails() {
    const username = this.cookieService.get(USER_COOKIE_KEY);
    return this.getUser(username);
  }

  async createUser(user: User) {
    const existingUser = this.getUser(user.username);
    const existingEmail = this.getUserByEmail(user.email);

    if (existingUser || existingEmail) {
      throw new Error('User with this username or email already exists!');
    }

    const hashedPassword = await this.hashPassword(user.password);
    this.users.push({ ...user, password: hashedPassword });
  }

  isAuthenticated() {
    const username = this.cookieService.get(USER_COOKIE_KEY);
    return !!username;
  }

  async validatePassword(
    hashedPassword: string,
    plainPassword: string
  ): Promise<boolean> {
    // try {
    //   return await argon2.verify(hashedPassword, plainPassword);
    // } catch (error) {
    //   console.error('Password validation error:', error);
    //   return false;
    // }
    return hashedPassword === plainPassword;
  }

  async hashPassword(password: string): Promise<string> {
    // try {
    //   return await argon2.hash(password);
    // } catch (error) {
    //   console.error('Password hashing error:', error);
    //   throw new Error('Failed to hash password');
    // }
    return password;
  }
}
