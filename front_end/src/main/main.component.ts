import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../shop/services/product.service';
import { RandomService } from '../common/services/common.service';

@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
})
export class MainComponent implements OnInit {
  constructor(private product: ProductService, private rand: RandomService) {}

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
      data = this.product.sortProducts(data, 'rating');
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
    this.getPopProducts();
    this.getProducts();
    this.getCategories();
  }

  categories: string[] = ['A', 'B', 'C'];
  items: Product[] = [
    {
      id: 1,
      title: 'skate-board',
      category: 'sports',
      uri: 'https://picsum.photos/seed/angular/100',
      price: 360000,
      description: '',
      rating: {
        rate: 0,
        count: 0,
      },
    },
    {
      id: 2,
      title: 'wood-desk',
      category: 'office',
      uri: 'https://picsum.photos/seed/250/100',
      price: 360000,
      description: '',
      rating: {
        rate: 0,
        count: 0,
      },
    },
    {
      id: 3,
      title: 'mount-bike',
      category: 'sports',
      uri: 'https://picsum.photos/seed/Cool/100',
      price: 360000,
      description: '',
      rating: {
        rate: 0,
        count: 0,
      },
    },
  ];
  popitems = this.items;
}
