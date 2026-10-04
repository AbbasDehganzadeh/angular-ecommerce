import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouterModule,
  RouterOutlet,
  RouterLinkActive,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { appConfig } from './app.config';
import { MainModule } from './main/main.module';
import { FooterComponent, HeaderComponent } from './common/components';
import { MetaService } from './common/services/meta.service';
import { filter, pluck, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `  
  <app-header/>
  <main class="main-content">
    <router-outlet></router-outlet>
  </main>
  <app-footer/>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      margin-top: .5rem;
      padding-top: 1rem;
    }
  `,
  ],
  imports: [
    MainModule,
    CommonModule,
    RouterModule,
    RouterOutlet,
    RouterLinkActive,
    HeaderComponent,
    FooterComponent,
  ],
  standalone: true,
})
export class Appcomponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private meta: MetaService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        pluck('urlAfterRedirects'),
        tap((data: string) => this.meta.updateMetaTags(data))
      )
      .subscribe();
  }
}

bootstrapApplication(Appcomponent, appConfig);
