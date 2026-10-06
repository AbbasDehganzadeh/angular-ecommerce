import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-footer-links",
  template: `
    <div class="footer-links">
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a routerLink="/">Home</a></li>
          <li><a routerLink="/shop/products">Shop</a></li>
          <li><a routerLink="/cart">Cart</a></li>
          <li><a routerLink="/about">About</a></li>
          <li><a routerLink="/contact-us">Contact Us</a></li>
          <li><a routerLink="/user/profile">Profile</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>Customer Service</h3>
        <ul>
          <li><a routerLink="/shipping">Shipping Info</a></li>
          <li><a routerLink="/returns">Returns</a></li>
          <li><a routerLink="/faqs">FAQs</a></li>
        </ul>
      </div>
    </div>
  `,
  standalone: true,
  imports: [RouterLink],
})
export class FooterLinksComponent {}
