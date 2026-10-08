import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../../../models/product.model";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../../cart/services/cart.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.scss",
})
export class ProductComponent implements OnInit {
  item: Product = {
    id: 1,
    title: "Loading...",
    description: "Loading product details...",
    price: 0,
    category: "loading",
    uri: "https://picsum.photos/seed/loading/400",
    rating: {
      rate: 0,
      count: 0,
    },
  };
  simItems: Product[] = [];
  recentProducts: Product[] = [];
  isInCart$!: Observable<boolean>;
  isWishlisted = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {
  }

  _id!: string;
  @Input()
  get id() {
    return this._id;
  }
  set id(productId: string) {
    this.productService.getProduct(productId).subscribe((data) => {
      this.item = data.product;
      this.productService.addToRecentProducts(data.product);
      this.getProductsByCategory();
    });
    this._id = productId;
  }

  getRecentProducts() {
    this.recentProducts = this.productService
      .getRecentProducts()
      .filter((p) => p.id !== Number(this._id));
  }

  getProductsByCategory() {
    if (this.item?.category) {
      this.productService
        .getProductsByCategory(this.item.category)
        .subscribe((data) => {
          this.simItems = data.products.filter((p) => p.id !== this.item.id);
        });
    }
  }

  addItem() {
    if (this.item) {
      this.cartService.addItem(this.item);
    }
  }

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
    // TODO: Implement wishlist functionality
  }

  ngOnInit() {
    this.isInCart$ = this.cartService.isInCart(Number(this._id));
    this.getRecentProducts()
  }

  ngOnChanges()
  {
    this.isInCart$ = this.cartService.isInCart(Number(this._id));
  if (this.id !== this._id) {
    this.getRecentProducts()
    }
  }
}
