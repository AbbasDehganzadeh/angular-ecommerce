import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TruncatePipe } from '../pipes/strings.pipe';

@Component({
  selector: 'app-card-compact',
  template: `
  <mat-card [appearance]="appearance" class="card">
    <a [routerLink]="['/shop', 'product', id]" routerLinkActive="active" class="card-link not-anchor">
      <mat-card-header class="card-header">
        <p class="category"><strong>{{category}}</strong></p>
      </mat-card-header>
      <div class="image-container">
        <img mat-card-image 
          [src]="pictureUri"
          [alt]="name"
          class="card-image">
      </div>
      <mat-card-content class="card-content">
        <span class="title">{{name | truncate:titleTruncate}}</span>
      </mat-card-content>
      <mat-card-actions class="card-actions">
        <span class="price">{{price | number:priceFormat}}</span>
        <ng-content select="[actions]"></ng-content>
      </mat-card-actions>
    </a>
  </mat-card>
`,
  styles: [
    `
    .card {
      height: 100%;
      background-color: var(--color-white);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                   0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
    }

    .card-link {
      display: flex;
      flex-direction: column;
      height: 100%;
      text-decoration: none;
      color: inherit;
    }

    .card-header {
      padding: var(--spacing-md) var(--spacing-md) 0;
    }

    .category {
      font-size: 0.875rem;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .image-container {
      padding: var(--spacing-md);
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .card-content {
      flex: 1;
      padding: var(--spacing-md);
    }

    .title {
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-gray-800);
      display: block;
      line-height: 1.4;
    }

    .card-actions {
      padding: var(--spacing-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--color-gray-200);
      background: var(--color-gray-50);
    }

    .price {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-primary-dark);
    }

    @media (max-width: 768px) {
      .card {
        max-width: 300px;
        margin: 0 auto;
      }

      .image-container {
        padding: var(--spacing-sm);
      }

      .card-content {
        padding: var(--spacing-sm);
      }

      .title {
        font-size: 0.875rem;
      }

      .price {
        font-size: 1rem;
      }
    }
  `,
  ],
  standalone: true,
  imports: [RouterLink, RouterModule, DecimalPipe, TruncatePipe, MatCardModule],
})
export class CardCompactComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() category!: string;
  @Input() pictureUri!: string;
  @Input() price!: number;
  @Input() appearance: 'outlined' | 'raised' = 'outlined';
  @Input() titleTruncate = '25c';
  @Input() priceFormat = '1.0-0';
}
