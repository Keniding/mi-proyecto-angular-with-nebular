import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NbLayoutModule, NbThemeService, NbButtonModule } from '@nebular/theme';
import { NbAuthModule } from '@nebular/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NbLayoutModule,
    NbButtonModule,
    NbAuthModule,
  ],
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentTheme: string = 'dark';
  private readonly isBrowser: boolean;

  constructor(
    private readonly themeService: NbThemeService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.currentTheme = savedTheme;
        this.themeService.changeTheme(savedTheme);
      }

      this.themeService.onThemeChange()
        .subscribe((theme: any) => {
          this.currentTheme = theme.name;
          localStorage.setItem('theme', theme.name);
        });
    }
  }

  toggleTheme() {
    if (this.isBrowser) {
      const newTheme = this.currentTheme === 'dark' ? 'default' : 'dark';
      this.themeService.changeTheme(newTheme);
    }
  }
}
