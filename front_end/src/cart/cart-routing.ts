import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CartComponent } from "./pages/cart.component";
import { CheckoutComponent } from "./pages/checkout.component";
import { OrderComponent } from "./pages/order.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: CartComponent,
  },
  {
    path: "checkout",
    component: CheckoutComponent,
  },
  {
    path: "order",
    component: OrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
