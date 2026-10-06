import { Component } from "@angular/core";

@Component({
  selector: "app-hero-banner",
  template: `
    <div class="banner-grid">
      @for (feature of features; track feature) {
        <div class="banner-card">
          <div class="banner-icon">
            <span class="material-icons">{{ feature.icon }}</span>
          </div>
          <h3 class="banner-title">{{ feature.title }}</h3>
          <p class="banner-description">{{ feature.description }}</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .banner-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--spacing-lg);
        margin: var(--spacing-xl) 0;
      }

      .banner-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.15);
        }
      }

      .banner-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-full);
        background: var(--color-primary);
        display: grid;
        place-items: center;
        margin-bottom: var(--spacing-md);

        .material-icons {
          font-size: 24px;
          color: var(--color-white);
        }
      }

      .banner-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-white);
        margin-bottom: var(--spacing-sm);
      }

      .banner-description {
        color: var(--color-gray-300);
        line-height: 1.6;
      }
    `,
  ],
  standalone: true,
})
export class HeroBannerComponent {
  features = [
    {
      icon: "shopping_cart",
      title: "Easy Shopping",
      description: "Find and purchase products with just a few clicks",
    },
    {
      icon: "local_shipping",
      title: "Fast Delivery",
      description: "Get your products delivered right to your doorstep",
    },
    {
      icon: "security",
      title: "Secure Payments",
      description: "Shop with confidence using our secure payment system",
    },
  ];
}
