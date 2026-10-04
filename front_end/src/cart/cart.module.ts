import { NgModule } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CartComponent } from './pages/cart.component';
import { CartRoutingModule } from './cart-routing';

@NgModule({
  declarations: [CartComponent],
  imports: [AsyncPipe, CurrencyPipe, CartRoutingModule, MatButtonModule],
})
export class CartModule {}
