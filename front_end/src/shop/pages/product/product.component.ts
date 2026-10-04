import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { RandomService } from '../../../common/services/common.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  simItems: Product[] = [];
  recentProducts: Product[] = [];
  isInCart$: Observable<boolean>;
  isWishlisted = false;

  constructor(
    private product: ProductService,
    private cart: CartService,
    private rand: RandomService
  ) {
    this.isInCart$ = this.cart.isInCart(Number(this._id));
  }

  _id!: string;
  @Input()
  get id() {
    return this._id;
  }
  set id(productId: string) {
    this.product.getProduct(productId).subscribe((data) => {
      let random = this.rand.generateRandom();
      data.uri = `https://picsum.photos/seed/${random}/400`;
      this.item = data;
      this.product.addToRecentProducts(data);
      this.getProductsByCategory();
    });
    this._id = productId;
  }

  getProductsByCategory() {
    if (this.item?.category) {
      this.product
        .getProductByCategory(this.item.category)
        .subscribe((data) => {
          data.map((obj) => {
            let random = this.rand.generateRandom();
            obj.uri = `https://picsum.photos/seed/${random}/400`;
          });
          this.simItems = data.filter((p) => p.id !== this.item.id);
        });
    }
  }

  addItem() {
    if (this.item) {
      this.cart.addItem(this.item);
    }
  }

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
    // TODO: Implement wishlist functionality
  }

  ngOnInit() {
    this.recentProducts = this.product
      .getRecentProducts()
      .filter((p) => p.id !== Number(this._id));
  }

  item: Product = {
    id: 1,
    title: 'Loading...',
    description: 'Loading product details...',
    price: 0,
    category: 'loading',
    uri: 'https://picsum.photos/seed/loading/400',
    rating: {
      rate: 0,
      count: 0,
    },
  };
}
