import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../pipes/strings.pipe';

@Component({
  selector: 'app-card-full',
  template: `
    <mat-card [appearance]="appearance" class="card">
      <div class="card-container">
            <a [routerLink]="['/shop', 'product', id]" >
        <div class="image-container">
          <img [src]="pictureuri" [alt]="name" class="card-image">
        </div>
        </a>
        <div class="content-container">
          <mat-card-header>
            <div class="header-content">
              <h2 class="title">{{name}}</h2>
              <p class="category">{{category}}</p>
            </div>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{description|truncate:'20w'}}</p>
          </mat-card-content>
          <mat-card-actions>
            <a [routerLink]="['/shop', 'product', id]" class="details-button">
              View Details
            </a>
          </mat-card-actions>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `
    .card {
      width: 100%;
      background: var(--color-white);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                   0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
    }

    .card-container {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: var(--spacing-lg);
    }

    .image-container {
      padding: var(--spacing-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-gray-50);
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

    .content-container {
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
    }

    .header-content {
      margin-bottom: var(--spacing-md);
    }

    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-gray-900);
      margin: 0 0 var(--spacing-xs);
      line-height: 1.3;
    }

    .category {
      font-size: 0.875rem;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .description {
      color: var(--color-gray-600);
      line-height: 1.6;
      margin: var(--spacing-md) 0;
    }

    .details-button {
      display: inline-block;
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--color-primary);
      color: var(--color-white);
      text-decoration: none;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: var(--color-primary-dark);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .card-container {
        grid-template-columns: 1fr;
      }

      .image-container {
        aspect-ratio: 16/9;
      }

      .content-container {
        padding: var(--spacing-md);
      }

      .title {
        font-size: 1.25rem;
      }

      .description {
        font-size: 0.875rem;
      }
    }
  `,
  ],
  standalone: true,
  imports: [RouterLink, DecimalPipe, TruncatePipe, MatCardModule],
})
export class CardFullComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() category!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() pictureuri!: string;
  @Input() appearance: 'outlined' | 'raised' = 'outlined';
}
