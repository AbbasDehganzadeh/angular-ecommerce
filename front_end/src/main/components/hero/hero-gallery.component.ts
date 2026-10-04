import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-gallery',
  template: `
    <div class="gallery-container">
      <h3 class="gallery-title">Featured Products</h3>
      <div class="gallery-grid">
        @for (item of galleryItems; track item)
        {<div 
          class="gallery-item" 
          [style.background-image]="'url(' + item.image + ')'"
        >
          <div class="gallery-overlay">
            <h4 class="gallery-item-title">{{item.title}}</h4>
            <p class="gallery-item-price">{{item.price | currency}}</p>
          </div>
        </div>}
      </div>
    </div>
  `,
  styles: [
    `
    .gallery-container {
      margin-top: var(--spacing-xl);
    }

    .gallery-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-white);
      margin-bottom: var(--spacing-lg);
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
    }

    .gallery-item {
      aspect-ratio: 1;
      border-radius: var(--radius-md);
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;
      cursor: pointer;

      &:hover .gallery-overlay {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .gallery-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.8),
        rgba(0, 0, 0, 0.4)
      );
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: var(--spacing-md);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }

    .gallery-item-title {
      color: var(--color-white);
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: var(--spacing-xs);
    }

    .gallery-item-price {
      color: var(--color-primary-light);
      font-weight: 600;
    }
  `,
  ],
  imports: [CurrencyPipe],
  standalone: true,
})
export class HeroGalleryComponent {
  galleryItems = [
    {
      image: 'https://picsum.photos/400/400?random=1',
      title: 'Premium Product 1',
      price: 99.99,
    },
    {
      image: 'https://picsum.photos/400/400?random=2',
      title: 'Premium Product 2',
      price: 149.99,
    },
    {
      image: 'https://picsum.photos/400/400?random=3',
      title: 'Premium Product 3',
      price: 199.99,
    },
  ];
}
