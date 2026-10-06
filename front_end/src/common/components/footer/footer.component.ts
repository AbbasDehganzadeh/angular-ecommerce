import { Component } from "@angular/core";
import { FooterCompanyComponent } from "./footer-company.component";
import { FooterLinksComponent } from "./footer-links.component";
import { FooterNewsletterComponent } from "./footer-newsletter.component";
import { FooterSocialComponent } from "./footer-social.component";
import { FooterPaymentComponent } from "./footer-payment.component";

@Component({
  selector: "app-footer",
  template: `
    <footer class="footer">
      <div class="footer-content">
        <app-footer-company />
        <app-footer-links />
        <app-footer-newsletter />
        <div class="footer-bottom">
          <app-footer-social />
          <app-footer-payment />
        </div>
      </div>
    </footer>
  `,
  styleUrls: ["./footer.styles.scss"],
  standalone: true,
  imports: [
    FooterCompanyComponent,
    FooterLinksComponent,
    FooterNewsletterComponent,
    FooterSocialComponent,
    FooterPaymentComponent,
  ],
})
export class FooterComponent {}
