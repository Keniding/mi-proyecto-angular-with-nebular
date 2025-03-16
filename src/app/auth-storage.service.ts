import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NbTokenStorage, NbAuthToken, NbAuthTokenParceler } from '@nebular/auth';

@Injectable()
export class SSRSafeTokenStorage implements NbTokenStorage {
  private readonly isBrowser: boolean;
  private readonly key = 'auth_app_token';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly parceler: NbAuthTokenParceler
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get(): NbAuthToken {
    if (this.isBrowser) {
      const raw = localStorage.getItem(this.key);
      if (raw) {
        return this.parceler.unwrap(raw);
      }
    }
    return this.parceler.unwrap('{}');
  }

  set(token: NbAuthToken): void {
    if (this.isBrowser) {
      localStorage.setItem(this.key, this.parceler.wrap(token));
    }
  }

  clear(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.key);
    }
  }
}
