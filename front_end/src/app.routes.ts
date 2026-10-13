import { Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { ContactUsComponent } from "./main/pages/comtact-us.component";
import { AboutComponent } from "./main/pages/about.component";
import { FaqComponent } from "./main/pages/faq.component";
import { CheckoutComponent } from "./cart/pages/checkout.component";
import { OrderComponent } from "./cart/pages/order.component";
import { isAuthenticated } from "./user/guards/user.guard";
import { hasBeenCheckedout } from "./cart/guards/checkout.guard";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home",
  },
  {
    path: "home",
    component: MainComponent,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  {
    path: "faqs",
    component: FaqComponent,
  },
  {
    path: "contact-us",
    component: ContactUsComponent,
  },
  {
    path: "checkout",
    component: CheckoutComponent,
    canActivate: [isAuthenticated, hasBeenCheckedout],
  },
  {
    path: "order",
    component: OrderComponent,
    canActivate: [isAuthenticated, hasBeenCheckedout],
  },
  {
    path: "cart",
    loadChildren: () => import("./cart/cart.module").then((m) => m.CartModule),
  },
  {
    path: "shop",
    loadChildren: () => import("./shop/shop.module").then((m) => m.ShopModule),
  },
  {
    path: "user",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "**",
    redirectTo: "/home",
  },
];
