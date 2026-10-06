import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CategoriesComponent } from "./pages/category/categories.component";
import { ProductComponent } from "./pages/product/product.component";
import { ProductsComponent } from "./pages/product/products.component";

export const routes: Routes = [
  {
    path: "categories",
    component: CategoriesComponent,
  },
  {
    path: "product/:id",
    // loadComponent: () => import('./pages/product/product.component').then(c=>c.)
    component: ProductComponent,
  },
  {
    path: "products",
    // loadComponent: () =>
    //   import('./pages/product/products.component').then(
    //     (c) => c.ProductsComponent
    //   ),
    component: ProductsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
