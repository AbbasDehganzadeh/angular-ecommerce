import { Component, Input } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { OrderItem } from "../services/order.service";

@Component({
  selector: "app-order-items-table",
  template: `
    <table mat-table [dataSource]="items" class="mat-elevation-z1">
      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Qty</th>
        <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
      </ng-container>
      <ng-container matColumnDef="item">
        <th mat-header-cell *matHeaderCellDef>Item</th>
        <td mat-cell *matCellDef="let item">
          <h3>{{ item.title }}</h3>
          <span>{{ item.category }}</span>
        </td>
      </ng-container>
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let item">{{ item.price | currency }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
          padding: var(--spacing-sm);
          text-align: left;
          border-bottom: 1px solid var(--color-gray-200);
        }

        th {
          font-weight: 600;
          color: var(--color-gray-600);
        }
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, MatTableModule, CurrencyPipe],
})
export class OrderItemsTableComponent {
  @Input() items: OrderItem[] = [];
  displayedColumns = ["quantity", "item", "price"];
}
