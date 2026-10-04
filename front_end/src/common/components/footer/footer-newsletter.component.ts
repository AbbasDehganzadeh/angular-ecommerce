import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer-newsletter',
  template: `
    <div class="footer-section newsletter">
      <h3>Stay Updated</h3>
      <p>Subscribe to our newsletter for updates and exclusive offers!</p>
      <form class="newsletter-form" (submit)="onSubmit($event)">
        <input 
          type="email" 
          placeholder="Enter your email"
          [(ngModel)]="email"
          name="email"
          required
        >
        <button type="submit">Subscribe</button>
      </form>
    </div>
  `,
  standalone: true,
  imports: [FormsModule],
})
export class FooterNewsletterComponent {
  email = '';

  onSubmit(event: Event) {
    event.preventDefault();
    //TODO: Handle newsletter subscription
    //console.log('Newsletter subscription:', this.email);
    this.email = '';
  }
}
