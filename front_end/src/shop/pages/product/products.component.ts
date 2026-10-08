import { Component, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Observable,
  catchError,
  finalize,
  map,
  tap,
  of,
  switchMap,
} from "rxjs";
import { Product } from "../../../models/product.model";
import { ProductService, sortingType } from "../../services/product.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
})
export class ProductsComponent {
  products$: Observable<Product[]>;
  productsCount = signal<number>(0);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  sorting: sortingType = "alphabet";
  category = "";
  search = "";

  valueStart!: number;
  valueEnd!: number;
  private minPrice = signal<number>(0);
  private maxPrice = signal<number>(1000);
  readonly min = computed(() => this.minPrice());
  readonly max = computed(() => this.maxPrice());

  // initial product count & page
  count!: number;
  page!: number;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.products$ = this.route.queryParams.pipe(
      switchMap((params) => {
        this.loading.set(true);
        this.error.set(null);

        this.search = params["_kw"] || "";
        this.valueStart = params["_min"] || this.minPrice();
        this.valueEnd = params["_max"] || this.maxPrice();
        this.sorting = params["_sort"] || "alphabet";
        this.category = params["category"] || "";
        this.count = Number(params["count"]) || 5;
        this.page = Number(params["page"]) || 1;
        const query = {
          search: this.search,
          min: this.valueStart,
          max: this.valueEnd,
          sort: this.sorting,
          category: this.category,
          limit: this.count,
          offset: (this.page - 1) * this.count,
        };

        return this.productService.getProducts(query).pipe(
          map((data) => {
            this.productsCount.set(data.productsCount);
            return data.products;
          }),
          tap((products) => {
            console.info({ products, productsCount: this.productsCount() });
            // Update max price based on highest product price
            const maxProductPrice = Math.max(...products.map((p) => p.price));
            if (maxProductPrice > this.maxPrice()) {
              this.maxPrice.set(maxProductPrice);
            }
          }),
          catchError((error) => {
            this.error.set("Failed to load products. Please try again.");
            return of([]);
          }),
          finalize(() => this.loading.set(false)),
        );
      }),
    );
  }

  retryLoading() {
    this.router.navigate(["/shop/products"], {
      queryParamsHandling: "merge",
    });
  }
}
