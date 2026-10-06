import { Component } from "@angular/core";
import { HeroHeaderComponent } from "./hero-header.component";
import { HeroBannerComponent } from "./hero-banner.component";
import { HeroGalleryComponent } from "./hero-gallery.component";

@Component({
  selector: "app-hero",
  template: `
    <div class="hero-container">
      <div class="hero-content">
        <app-hero-header />
        <app-hero-banner />
        <app-hero-gallery />
      </div>
      <div class="hero-overlay"></div>
    </div>
  `,
  styles: [
    `
    .hero-container {
      position: relative;
      min-height: 100vh;
      background-image: var(--hero-bg-image);
      background-size: stretch;
      background-repeat: no-repeat;

      @media (min-width: 768px) {
        background-size: cover;
        background-position: center;
      }
      
      color: var(--hero-text-color);
      overflow: hidden;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      opacity: .2,
      padding: var(--spacing-xl);
      max-width: var(--content-width-xl);
      margin: 0 auto;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.7)
      );
      z-index: 1;
    }

    @media (max-width: 768px) {
      .hero-content {
        padding: var(--spacing-lg);
      }
    }
  `,
  ],
  standalone: true,
  imports: [HeroHeaderComponent, HeroBannerComponent, HeroGalleryComponent],
})
export class HeroComponent {}
