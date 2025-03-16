import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {NbLayoutModule, NbThemeModule} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken, NbTokenStorage} from '@nebular/auth';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { SSRSafeTokenStorage } from './auth-storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(withFetch()),
    { provide: NbTokenStorage, useClass: SSRSafeTokenStorage },
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'dark' }),
      NbLayoutModule,
      NbEvaIconsModule,
      NbAuthModule.forRoot({
        strategies: [
          NbPasswordAuthStrategy.setup({
            name: 'email',
            token: {
              class: NbAuthJWTToken,
              key: 'token'
            },
            baseEndpoint: 'http://localhost:3000',
            login: {
              endpoint: '/auth/login',
              method: 'post',
            },
            register: {
              endpoint: '/auth/register',
              method: 'post',
            },
            logout: {
              endpoint: '/auth/logout',
              method: 'post',
            },
            requestPass: {
              endpoint: '/auth/request-pass',
              method: 'post',
            },
            resetPass: {
              endpoint: '/auth/reset-pass',
              method: 'post',
            },
          }),
        ],
        forms: {},
      }),
    ),
  ],
};
