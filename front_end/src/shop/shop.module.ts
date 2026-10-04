import { NgModule } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatGridListModule,
  MatGridList,
  MatGridTile,
} from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShopRoutingModule } from './shop-routing';
import { CategoriesComponent } from './pages/category/categories.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductsComponent } from './pages/product/products.component';
import { FilterProductComponent } from './components/filter-product.component';
import {
  CardCompactComponent,
  CardInlineComponent,
  CardFullComponent,
} from '../common/components';

@NgModule({
  declarations: [CategoriesComponent, ProductComponent, ProductsComponent],
  imports: [
    AsyncPipe,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatGridList,
    MatGridTile,
    MatProgressSpinnerModule,
    ShopRoutingModule,
    FilterProductComponent,
    CardCompactComponent,
    CardInlineComponent,
    CardFullComponent,
  ],
})
export class ShopModule {}
