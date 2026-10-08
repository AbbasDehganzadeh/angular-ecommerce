import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Product } from "../../models/product.model";
import { CardCompactComponent } from "../../common/components";

@Component({
  selector: "app-product-section",
  template: `
    <section class="product-section">
      <div class="section-header">
        <h2 class="section-title">{{ title }}</h2>
        <div class="section-controls">
          <button
            class="scroll-button prev"
            [class.hidden]="isScrollStart"
            (click)="scrollLeft()"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            class="scroll-button next"
            [class.hidden]="isScrollEnd"
            (click)="scrollRight()"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div #scrollContainer class="products-container" (scroll)="onScroll()">
        @for (product of products; track product.id) {
          <div class="product-card">
            <app-card-compact
              [id]="product.id"
              [name]="product.title"
              [category]="product.category"
              [pictureUri]="product.uri"
              [price]="product.price"
            />
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .product-section {
        position: relative;
        width: 100%;
        margin: var(--spacing-lg) 0;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 var(--spacing-md);
        margin-bottom: var(--spacing-md);
      }

      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-gray-900);
        margin: 0;
      }

      .section-controls {
        display: flex;
        gap: var(--spacing-sm);
      }

      .scroll-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: var(--color-white);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--color-gray-100);
          transform: translateY(-1px);
        }

        &.hidden {
          opacity: 0;
          pointer-events: none;
        }

        i {
          font-size: 1rem;
          color: var(--color-gray-900);
        }
      }

      .products-container {
        display: flex;
        gap: var(--spacing-md);
        overflow: auto;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        padding: var(--spacing-md);
        scroll-padding: var(--spacing-md);
        will-change: transform;

        /* Hide scrollbar but keep functionality */
        scrollbar-width: none;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
          display: none;
        }
      }

      .product-card {
        flex: 0 0 auto;
        transform: translateZ(0);

        @media (min-width: 320px) {
          width: calc(40vw - var(--spacing-md));
          min-width: 200px;
        }

        @media (min-width: 768px) {
          width: calc(28.57vw - var(--spacing-lg));
          min-width: 250px;
        }

        @media (min-width: 1024px) {
          width: calc(22.22vw - var(--spacing-xl));
          min-width: 300px;
        }
      }

      /* Container heights */
      @media (min-width: 320px) {
        .products-container {
          max-height: 300px;
          gap: var(--spacing-md);
        }
      }

      @media (min-width: 768px) {
        .products-container {
          max-height: 420px;
          gap: var(--spacing-lg);
        }
      }

      @media (min-width: 1024px) {
        .products-container {
          max-height: 400px;
          gap: var(--spacing-xl);
        }
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, CardCompactComponent],
})
export class ProductSectionComponent implements AfterViewInit {
  @Input() title = "";
  @Input() products: Product[] = [];

  @ViewChild("scrollContainer") scrollContainer!: ElementRef;

  isScrollStart = true;
  isScrollEnd = false;

  ngAfterViewInit() {
    this.checkScrollPosition();
  }

  onScroll() {
    this.checkScrollPosition();
  }

  checkScrollPosition() {
    const element = this.scrollContainer.nativeElement;
    this.isScrollStart = element.scrollLeft <= 0;
    this.isScrollEnd =
      element.scrollLeft + element.clientWidth >= element.scrollWidth;
  }

  scrollLeft() {
    const element = this.scrollContainer.nativeElement;
    element.scrollBy({ left: -element.clientWidth, behavior: "smooth" });
  }

  scrollRight() {
    const element = this.scrollContainer.nativeElement;
    element.scrollBy({ left: element.clientWidth, behavior: "smooth" });
  }
}
