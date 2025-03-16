import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const configWithHashStrategy = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};

bootstrapApplication(AppComponent, configWithHashStrategy)
  .catch((err) => console.error(err));
