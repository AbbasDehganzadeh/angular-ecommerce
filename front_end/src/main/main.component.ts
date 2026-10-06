import { Component, OnInit } from "@angular/core";
import { Product } from "../models/product.model";
import { ProductService } from "../shop/services/product.service";
import { RandomService } from "../common/services/common.service";

@Component({
  selector: "app-main",
  templateUrl: "main.component.html",
})
export class MainComponent implements OnInit {
  constructor(
    private product: ProductService,
    private rand: RandomService,
  ) {}

  getProducts() {
    this.product.getProducts().subscribe((data) => {
      data.map((obj) => {
        let random = this.rand.generateRandom();
        obj.uri = `https://picsum.photos/seed/${random}/100`;
      });
      this.items = data;
    });
  }

  getPopProducts() {
    this.product.getProducts().subscribe((data) => {
      data = this.product.sortProducts(data, "rating");
      data.map((obj) => {
        let random = this.rand.generateRandom();
        obj.uri = `https://picsum.photos/seed/${random}/100`;
      });
      this.popitems = data;
    });
  }

  getCategories() {
    this.product.getCategories().subscribe((data) => (this.categories = data));
  }

  ngOnInit() {
    this.getProducts();
    this.getPopProducts();
    this.getCategories();
  }

  categories: string[] = ["A", "B", "C"];
  items: Product[] = [];
  popitems = this.items;
}
