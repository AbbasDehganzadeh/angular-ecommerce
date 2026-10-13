import { NgModule } from "@angular/core";
import { AsyncPipe, CurrencyPipe, CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CartComponent } from "./pages/cart.component";
import { CartRoutingModule } from "./cart-routing";

@NgModule({
  declarations: [CartComponent],
  imports: [
    AsyncPipe,
    CurrencyPipe,
    CommonModule,
    FormsModule,
    RouterModule,
    CartRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class CartModule {}
