import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-hero-header",
  template: `
    <header class="hero-header">
      <h1 class="hero-title">Discover Amazing Products</h1>
      <h2 class="hero-subtitle">Find exactly what you're looking for</h2>
      <div class="search-container">
        <input
          type="search"
          placeholder="Search products ..."
          [(ngModel)]="keyword"
          id="search-input"
          name="keyword"
        />
        <button title="search" class="search-button" (click)="searchProduct()">
          <span class="material-icons">search</span>
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      .hero-header {
        text-align: center;
        margin-bottom: var(--spacing-xl);
      }

      .hero-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 800;
        letter-spacing: -0.02rem;
        margin-bottom: var(--spacing-md);
        color: var(--color-white);
        font-family: var(--font-heading);
      }

      .hero-subtitle {
        font-size: clamp(1.25rem, 2.5vw, 1.75rem);
        font-weight: 400;
        color: var(--color-gray-200);
        margin-bottom: var(--spacing-lg);
      }

      .search-container {
        max-width: 600px;
        margin: 0 auto;
        display: flex;
        gap: var(--spacing-sm);
      }

      #search-input {
        flex: 1;
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-lg);
        border: 2px solid transparent;
        background: rgba(255, 255, 255, 0.1);
        color: var(--color-white);
        font-size: 1.125rem;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          background: rgba(255, 255, 255, 0.15);
        }

        &::placeholder {
          color: var(--color-gray-400);
        }
      }

      .search-button {
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-lg);
        border: none;
        background: var(--color-primary);
        color: var(--color-white);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      }
    `,
  ],
  standalone: true,
  imports: [FormsModule],
})
export class HeroHeaderComponent {
  constructor(private router: Router) {}
  keyword = "";
  searchProduct() {
    this.router.navigate(["shop/products"], {
      queryParams: { _kw: this.keyword },
      queryParamsHandling: "replace",
    });
  }
}
