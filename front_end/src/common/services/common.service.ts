import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RandomService {
  constructor() {}

  generateRandom() {
    return Math.floor(Math.random() * 1000);
  }
}
