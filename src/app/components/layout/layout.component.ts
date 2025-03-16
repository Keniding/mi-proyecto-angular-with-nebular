import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  NbLayoutModule,
  NbSelectModule,
  NbThemeService,
  NbSidebarModule,
  NbOptionModule,
  NbMenuModule,
  NbIconModule,
  NbSidebarService,
  NbButtonModule,
  NbCardModule,
  NbUserModule,
  NbContextMenuModule,
  NbMenuService,
  NbSidebarState
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NbLayoutModule,
    NbSelectModule,
    NbSidebarModule,
    NbOptionModule,
    NbMenuModule,
    NbIconModule,
    NbButtonModule,
    NbCardModule,
    NbUserModule,
    NbContextMenuModule,
    NbEvaIconsModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  currentTheme: string = 'default';
  sidebarState: NbSidebarState = 'expanded';

  items = [
    {
      title: 'Salón',
      icon: 'grid-outline',
      link: '/salon',
      home: true,
    },
    {
      title: 'Pedidos',
      icon: 'clipboard-outline',
      children: [
        {
          title: 'Nuevo Pedido',
          icon: 'plus-outline',
          link: '/pedidos/nuevo',
        },
        {
          title: 'Pedidos Activos',
          icon: 'clock-outline',
          link: '/pedidos/activos',
        },
        {
          title: 'Historial',
          icon: 'archive-outline',
          link: '/pedidos/historial',
        },
      ],
    },
    {
      title: 'Menú',
      icon: 'book-open-outline',
      link: '/menu',
    },
    {
      title: 'Caja',
      icon: 'credit-card-outline',
      children: [
        {
          title: 'Generar Cuenta',
          icon: 'file-text-outline',
          link: '/caja/cuenta',
        },
        {
          title: 'Cobrar',
          icon: 'shopping-bag-outline',
          link: '/caja/cobrar',
        },
      ],
    },
    {
      title: 'Comunicación',
      icon: 'message-circle-outline',
      link: '/comunicacion',
    },
  ];

  userMenu = [
    { title: 'Perfil', icon: 'person-outline' },
    { title: 'Configuración', icon: 'settings-2-outline' },
    { title: 'Cerrar Sesión', icon: 'log-out-outline' }
  ];

  constructor(
    private readonly themeService: NbThemeService,
    private readonly sidebarService: NbSidebarService,
    private readonly menuService: NbMenuService
  ) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    this.menuService.onItemClick()
      .subscribe((event) => {
        if (event.item.title === 'Cerrar Sesión') {
          console.log('Cerrando sesión...');
          // this.authService.logout();
        }
      });
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
    this.currentTheme = themeName;
  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.sidebarState = this.sidebarState === 'compacted' ? 'expanded' : 'compacted';
  }

  onSidebarStateChange(state: NbSidebarState) {
    this.sidebarState = state;
    console.log('Sidebar state changed to:', state);
  }
}
