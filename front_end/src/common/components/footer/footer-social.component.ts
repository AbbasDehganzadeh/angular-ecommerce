import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-social',
  template: `
    <div class="social-links">
      <a href="facebook.com" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
      <a href="youtube.com" aria-label="Twitter"><i class="fab fa-youtube"></i></a>
      <a href="instagram.com" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
      <a href="linkedin.org" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
    </div>
  `,
  styles: [
    `
    .social-links {
      display: flex;
      gap: var(--spacing-md);
      
      a {
        color: #f5f5f5;
        font-size: 1.5rem;
        transition: color 0.3s ease;
        
        &:hover {
          color: var(--color-primary);
        }
      }
    }
  `,
  ],
  standalone: true,
})
export class FooterSocialComponent {}
