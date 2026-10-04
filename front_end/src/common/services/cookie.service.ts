import { Injectable } from '@angular/core';

export const USER_COOKIE_KEY = 'SHOP_USER_KEY';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  set(key: string, value: string, days = 7): void {
    const cookie = ` ${key}= ${value}`;
    document.cookie = cookie;
  }

  get(key: string): string {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=').map((c) => c.trim());
      if (cookieKey == key && key != '') {
        return cookieValue;
      }
    }
    return '';
  }

  delete(key: string): void {
    if (this.get(key)) {
      document.cookie = `${key}= `;
    }
  }
}
