import { ApplicationConfig } from "@angular/core";
import {
  provideRouter,
  PreloadAllModules,
  withPreloading,
  withComponentInputBinding,
} from "@angular/router";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { JwtInterceptor } from "./common/interceptors/auth.interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
    ),
    provideHttpClient(withFetch(), withInterceptors([JwtInterceptor])),
    provideAnimations(),
  ],
};
