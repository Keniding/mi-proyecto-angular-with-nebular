import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  NbLayoutModule,
  NbSelectModule,
  NbThemeService,
  NbSidebarModule,
  NbOptionModule
} from '@nebular/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NbLayoutModule,
    NbSelectModule,
    NbSidebarModule,
    NbOptionModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentTheme: string = 'default';

  constructor(private readonly themeService: NbThemeService) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    console.log(this.currentTheme);
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
    this.currentTheme = themeName;
  }
}
