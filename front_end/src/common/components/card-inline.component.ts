import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-card-inline",
  template: `
    <mat-card
      appearance="outlined"
      class="inline-card"
      [@hoverAnimation]="hover"
      (mouseenter)="hover = 'hovered'"
      (mouseleave)="hover = 'normal'"
    >
      <a
        [routerLink]="['/shop', 'products']"
        [queryParams]="{ category: title }"
        routerLinkActive="active"
        class="card-link not-anchor"
      >
        <mat-card-header class="card-header">
          <mat-card-title class="title">{{ title }}</mat-card-title>
          <div class="products-label">Products</div>
        </mat-card-header>
      </a>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 8px 0;
      }

      .inline-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: none;
        transition: all 0.3s ease;
      }

      .card-link {
        display: block;
        color: inherit;
        padding: 16px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
      }

      .title {
        font-size: 1.25rem;
        font-weight: 500;
        color: #2c3e50;
        margin: 0;
        text-transform: capitalize;
        letter-spacing: 0.5px;
      }

      .products-label {
        font-size: 0.875rem;
        color: #6c757d;
        background-color: #e9ecef;
        padding: 4px 12px;
        border-radius: 16px;
        transition: all 0.3s ease;
      }

      :host-context(.active) .inline-card {
        border-color: #3498db;
      }

      @media (hover: hover) {
        .inline-card:hover .products-label {
          background-color: #3498db;
          color: white;
        }
      }
    `,
  ],
  standalone: true,
  imports: [RouterLink, MatCardModule],
})
export class CardInlineComponent {
  @Input() title = "";
  hover: "normal" | "hovered" = "normal";
}
