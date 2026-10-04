import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-payment',
  template: `
    <div class="payment-methods">
      <i class="fab fa-cc-visa" aria-label="Visa"></i>
      <i class="fab fa-cc-mastercard" aria-label="Mastercard"></i>
      <i class="fab fa-cc-paypal" aria-label="PayPal"></i>
    </div>
  `,
  styles: [
    `
    .payment-methods {
      display: flex;
      gap: var(--spacing-md);
      
      i {
        font-size: 2rem;
        color: #f5f5f5;
      }
    }
  `,
  ],
  standalone: true,
})
export class FooterPaymentComponent {}
