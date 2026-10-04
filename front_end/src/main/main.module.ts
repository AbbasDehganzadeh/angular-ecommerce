import { NgModule } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MainComponent } from './main.component';
import { CardInlineComponent } from '../common/components';
import { HeroComponent } from './components/hero/hero.component';
import { ProductSectionComponent } from './components/product-section.component';

@NgModule({
  declarations: [MainComponent],
  imports: [
    RouterLink,
    RouterModule,
    MatButtonModule,
    CardInlineComponent,
    HeroComponent,
    ProductSectionComponent
  ],
  exports: [MainComponent],
})
export class MainModule {}