import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import { CartComponent } from './pages/cart.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CartComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule{}