import { CurrencyPipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { ProductService, sortingType } from "../services/product.service";

@Component({
  selector: "app-filter-product",
  template: `
    <div class="filter-container">
      <div class="filter-row top-row">
        <!-- Search Input -->
        <div class="search-field">
          <mat-label>Search product</mat-label>
          <input
            matInput
            type="search"
            placeholder="Search product ..."
            [(ngModel)]="keyword"
            (input)="updateSearch()"
            class="search-input"
          />
        </div>

        <!-- Sorting Selection -->
        <div class="sort-field">
          <mat-expansion-panel
            #sortingPanel
            [class.expanded]="sortingPanel.expanded"
            (mouseenter)="sortingPanel.open()"
            (mouseleave)="sortingPanel.close()"
          >
            <mat-expansion-panel-header [expandedHeight]="'8px'">
              <span>Sort By</span>
            </mat-expansion-panel-header>
            <mat-list>
              <mat-list-item role="listitem" (click)="sortProducts('rating')"
                ><strong>Popular</strong></mat-list-item
              >
              <mat-list-item role="listitem" (click)="sortProducts('price')"
                >Pricey</mat-list-item
              >
              <mat-list-item role="listitem" (click)="sortProducts('~price')"
                >Cheapest</mat-list-item
              >
              <mat-list-item role="listitem" (click)="sortProducts('alphabet')"
                >Alphabet</mat-list-item
              >
            </mat-list>
          </mat-expansion-panel>
        </div>

        <!-- Category Selection -->
        <div class="category-field">
          <mat-form-field>
            <mat-label>Categories</mat-label>
            <mat-select
              [(value)]="category"
              (selectionChange)="updateCategory()"
            >
              <mat-option value="">All Categories</mat-option>
              @for (categoy of categories; track categoy) {
                <mat-option [value]="categoy">{{ categoy }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div class="filter-row bottom-row">
        <!-- Price Range Selection -->
        <div class="price-range">
          <mat-label>Price Range</mat-label>
          <div class="price-values">
            <span>{{ MIN | currency }}</span>
            <span>{{ MAX | currency }}</span>
          </div>
          <mat-slider discrete [min]="0" [max]="1000" (change)="updateSlide()">
            <input [(value)]="MIN" matSliderStartThumb />
            <input [(value)]="MAX" matSliderEndThumb />
          </mat-slider>
        </div>

        <!-- Items Count Selection -->
        <div class="items-count">
          <mat-label>Items per page</mat-label>
          <mat-button-toggle-group name="itemCount">
            <mat-button-toggle (click)="updateCount(5)" value="5"
              >5</mat-button-toggle
            >
            <mat-button-toggle (click)="updateCount(10)" value="10"
              >10</mat-button-toggle
            >
            <mat-button-toggle (click)="updateCount(20)" value="20"
              >20</mat-button-toggle
            >
          </mat-button-toggle-group>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .filter-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
        padding: var(--spacing-md);
        background: var(--color-white);
        border-radius: var(--radius-lg);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .filter-row {
        display: flex;
        gap: var(--spacing-md);
        width: 100%;
      }

      /* Search Field */
      .search-field {
        flex: 1;
        min-width: 200px;
      }

      .search-input {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--radius-md);
        font-size: 1rem;
      }

      /* Sort Panel */
      .sort-field {
        width: 200px;

        ::ng-deep .mat-expansion-panel {
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-md) !important;
        }

        ::ng-deep .mat-expansion-panel-header {
          padding: 0 var(--spacing-md);
          height: 48px !important;
        }
      }

      /* Category Field */
      .category-field {
        width: 200px;

        ::ng-deep .mat-form-field {
          width: 100%;
        }
      }

      /* Price Range */
      .price-range {
        flex: 2;
        min-width: 200px;
      }

      mat-slider {
        width: 100%;
        margin: var(--spacing-sm) 0;
      }

      .price-values {
        display: flex;
        justify-content: space-between;
        margin-top: var(--spacing-xs);
        color: var(--color-gray-600);
        font-size: 0.875rem;
      }

      /* Items Count */
      .items-count {
        flex: 1;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      mat-button-toggle-group {
        margin-top: var(--spacing-xs);
      }

      /* Responsive Layout */
      @media (max-width: 767px) {
        .filter-row {
          flex-direction: column;
        }

        .sort-field,
        .category-field,
        .search-field,
        .price-range,
        .items-count {
          width: 100%;
        }

        .items-count {
          margin-top: var(--spacing-md);
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSliderModule,
  ],
})
export class FilterProductComponent implements OnInit {
  constructor(
    private product: ProductService,
    private router: Router,
  ) {}

  sorting!: sortingType;
  category = "";
  count = 5;
  valueStart = 0;
  valueEnd = 1000;

  @Output() categoryChange = new EventEmitter<string>();
  @Output() countChange = new EventEmitter<number>();
  @Output() slideChange = new EventEmitter<number[]>();

  @Input() keyword = "";
  @Input({ required: true }) MIN!: number;
  @Input({ required: true }) MAX!: number;

  getCategories() {
    this.product.getCategories().subscribe((data) => (this.categories = data));
  }

  updateCategory() {
    this.categoryChange.emit(this.category);
  }

  updateCount(count: number) {
    this.count = count;
    this.countChange.emit(count);
  }

  sortProducts(value: string) {
    this.sorting = value as sortingType;
    this.router.navigate(["/shop/products"], {
      queryParams: { _sort: value },
      queryParamsHandling: "merge",
    });
  }

  updateSearch() {
    this.router.navigate(["/shop/products"], {
      queryParams: { _kw: this.keyword },
      queryParamsHandling: "merge",
    });
  }

  updateSlide() {
    this.slideChange.emit([this.MIN, this.MAX]);
  }

  ngOnInit() {
    this.getCategories();
    this.valueStart = this.MIN;
    this.valueEnd = this.MAX;
  }

  categories: string[] = [];
}
