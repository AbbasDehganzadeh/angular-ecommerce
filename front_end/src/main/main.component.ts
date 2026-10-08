import { Component, OnInit } from "@angular/core";
import { Product } from "../models/product.model";
import {
  ProductService,
  productQueryType,
  sortingType,
} from "../shop/services/product.service";
import { RandomService } from "../common/services/common.service";

@Component({
  selector: "app-main",
  templateUrl: "main.component.html",
})
export class MainComponent implements OnInit {
  categories: string[] = [];
  items: Product[] = [];
  popitems = this.items;

  constructor(
    private productService: ProductService,
    private randService: RandomService,
  ) {}

  getProducts() {
    const sort: sortingType = "~time";
    const query: productQueryType = { sort, limit: 7 };
    this.productService
      .getProducts(query)
      .subscribe((data) => (this.items = data.products));
  }

  getPopProducts() {
    const sort: sortingType = "rating";
    const query: productQueryType = { sort, limit: 7 };
    this.productService
      .getProducts(query)
      .subscribe((data) => (this.popitems = data.products));
  }

  getCategories() {
    this.productService
      .getCategories()
      .subscribe((data) => (this.categories = data.categories));
  }

  ngOnInit() {
    this.getProducts();
    this.getPopProducts();
    this.getCategories();
  }
}
