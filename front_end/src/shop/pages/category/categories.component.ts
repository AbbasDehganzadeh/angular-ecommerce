import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.component.html',
})
export class CategoriesComponent {
  categories: string[] = ['A', 'B', 'C'];
  constructor(private http: ProductService) {}

  getCategories() {
    this.http.getCategories().subscribe((data) => (this.categories = data));
  }

  ngOnInit() {
    this.getCategories();
  }
}
