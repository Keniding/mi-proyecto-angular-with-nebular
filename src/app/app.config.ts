import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {NbLayoutModule, NbThemeModule} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';

// Proveedor personalizado para localStorage
const STORAGE_PROVIDER = {
  provide: 'LOCAL_STORAGE',
  useFactory: () => {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return {
      getItem: () => null,
      setItem: () => null,
      removeItem: () => null
    };
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    STORAGE_PROVIDER,
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'dark' }),
      NbLayoutModule,
      NbEvaIconsModule
    ),
  ],
};
