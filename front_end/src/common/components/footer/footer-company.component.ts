import { Component } from "@angular/core";

@Component({
  selector: "app-footer-company",
  template: `
    <div class="footer-section">
      <h3>About Us</h3>
      <p>
        Your trusted destination for quality products. We're committed to
        providing exceptional shopping experiences.
      </p>
      <div class="contact-info">
        <p><i class="fas fa-envelope"></i> support&#64;example.com</p>
        <p><i class="fas fa-phone"></i> (555) 123-4567</p>
        <p>
          <i class="fas fa-location-dot"></i> 123 Commerce St, Business City
        </p>
      </div>
    </div>
  `,
  standalone: true,
})
export class FooterCompanyComponent {}
