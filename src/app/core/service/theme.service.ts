import { Injectable } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeChanged = new Subject<string>();
  themeChanged$ = this.themeChanged.asObservable();

  constructor(private readonly nbThemeService: NbThemeService) {}

  getCurrentTheme(): string {
    return this.nbThemeService.currentTheme;
  }

  changeTheme(themeName: string) {
    this.nbThemeService.changeTheme(themeName);
    this.themeChanged.next(themeName);
  }
}
