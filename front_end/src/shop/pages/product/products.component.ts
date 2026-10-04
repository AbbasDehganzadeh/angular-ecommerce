import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  catchError,
  finalize,
  map,
  tap,
  of,
  switchMap,
} from 'rxjs';
import { Product } from '../../../models/product.model';
import { ProductService, sortingType } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { RandomService } from '../../../common/services/common.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  products$: Observable<Product[]>;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  sorting: sortingType = 'alphabet';
  category = '';
  search = '';
  valueStart!: number;
  valueEnd!: number;

  // Initialize signals with proper types
  private minPrice = signal<number>(0);
  private maxPrice = signal<number>(1000);

  // Computed signals for external access
  readonly min = computed(() => this.minPrice());
  readonly max = computed(() => this.maxPrice());

  // initial product count
  count = 5;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private rand: RandomService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.products$ = this.route.queryParams.pipe(
      switchMap((params) => {
        this.loading.set(true);
        this.error.set(null);

        this.sorting = params['_sort'] || 'alphabet';
        this.search = params['_kw'] || '';
        this.valueStart = params['_min'] || 0;
        this.valueEnd = params['_max'] || 1000;
        this.category = params['category'] || '';

        return (
          this.category
            ? this.productService.getProductByCategory(this.category)
            : this.productService.getProducts()
        ).pipe(
          tap((products) => {
            // Update max price based on highest product price
            const maxProductPrice = Math.max(...products.map((p) => p.price));
            if (maxProductPrice > this.maxPrice()) {
              this.maxPrice.set(maxProductPrice);
              this.valueEnd = maxProductPrice;
            }
          }),
          map((products) =>
            products.filter((item) => {
              const search = this.search.toLowerCase();
              let include = true;
              if (item.price < this.valueStart && item.price > this.valueEnd)
                include = false;
              if (
                search != '' &&
                !(
                  item.title.toLowerCase().includes(search) ||
                  item.description.toLowerCase().includes(search)
                )
              )
                include = false;
              return include;
            })
          ),
          map((products) => this.addImageUrls(products)),
          map((products) =>
            this.productService.sortProducts(products, this.sorting)
          ),
          catchError((error) => {
            this.error.set('Failed to load products. Please try again.');
            return of([]);
          }),
          finalize(() => this.loading.set(false))
        );
      })
    );
  }

  private addImageUrls(products: Product[]): Product[] {
    return products.map((product) => ({
      ...product,
      uri: `https://picsum.photos/seed/${this.rand.generateRandom()}/100`,
    }));
  }

  updateCount(count: number) {
    this.count = count;
  }

  updateSlide(values: number[]) {
    const [min, max] = values;
    this.router.navigate(['/shop/products'], {
      queryParams: { _min: min, _max: max },
      queryParamsHandling: 'merge',
    });
  }

  updateCategory(category: string) {
    this.categoryService.selectCategory(category);
  }

  retryLoading() {
    this.categoryService.selectCategory(this.category);
  }
}
