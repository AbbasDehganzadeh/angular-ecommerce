import { Component } from "@angular/core";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-categories",
  templateUrl: "categories.component.html",
})
export class CategoriesComponent {
  categories: string[] = [];
  constructor(private productService: ProductService) {}

  getCategories() {
    this.productService
      .getCategories()
      .subscribe((data) => (this.categories = data.categories));
  }

  ngOnInit() {
    this.getCategories();
  }
}
