import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core Angular providers
    // provideZoneChangeDetection({ eventCoalescing: true }),

    // Router configuration
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),

    // HTTP client
    provideHttpClient(withInterceptorsFromDi()),

    // Animations
    provideAnimations()
  ]
};
