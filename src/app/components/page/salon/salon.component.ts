import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbBadgeModule,
  NbLayoutRulerService,
  NbTooltipModule,
  NbSelectModule,
  NbInputModule,
  NbTabsetModule,
  NbContextMenuModule,
  NbPopoverModule
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';

interface Mesa {
  id: number;
  numero: string;
  estado: 'libre' | 'ocupada' | 'reservada' | 'pendiente';
  capacidad: number;
  tiempo?: string;
  ubicacion?: 'interior' | 'terraza';
  forma?: 'redonda' | 'cuadrada' | 'rectangular';
}

@Component({
  selector: 'app-salon',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbTooltipModule,
    NbSelectModule,
    NbInputModule,
    NbTabsetModule,
    NbContextMenuModule,
    NbPopoverModule
  ],
  templateUrl: 'salon.component.html',
  styleUrl: 'salon.component.scss',
})
export class SalonComponent implements OnInit, OnDestroy {
  mesas: Mesa[] = [];
  mesaSeleccionada: Mesa | null = null;
  filtroEstado: string = 'todos';
  filtroCapacidad: number = 0;
  vistaActual: 'grid' | 'list' = 'grid';
  private readonly temporizadores = new Map<number, any>();
  vistaMapa: string = 'todos';
  escalaZoom: number = 1;

  mesaMenuItems = [
    { title: 'Editar mesa', icon: 'edit-outline', data: 'editar' },
    { title: 'Reservar', icon: 'calendar-outline', data: 'reservar' },
    { title: 'Mover a otra ubicación', icon: 'move-outline', data: 'mover' },
    { title: 'Ver historial', icon: 'clock-outline', data: 'historial' },
    { title: 'Eliminar', icon: 'trash-2-outline', data: 'eliminar' }
  ];

  constructor(
    private readonly layoutRuler: NbLayoutRulerService
  ) {}

  ngOnInit(): void {
    this.layoutRuler.getDimensions().subscribe(dimensions => {
      console.log('Layout dimensions:', dimensions);
    });

    this.mesas = [
      { id: 1, numero: 'M1', estado: 'libre', capacidad: 2, ubicacion: 'interior', forma: 'cuadrada' },
      { id: 2, numero: 'M2', estado: 'ocupada', capacidad: 4, tiempo: '00:45', ubicacion: 'interior', forma: 'rectangular' },
      { id: 3, numero: 'M3', estado: 'reservada', capacidad: 6, tiempo: '19:30', ubicacion: 'terraza', forma: 'rectangular' },
      { id: 4, numero: 'M4', estado: 'pendiente', capacidad: 4, tiempo: '00:10', ubicacion: 'interior', forma: 'cuadrada' },
      { id: 5, numero: 'M5', estado: 'libre', capacidad: 2, ubicacion: 'terraza', forma: 'redonda' },
      { id: 6, numero: 'M6', estado: 'ocupada', capacidad: 8, tiempo: '01:15', ubicacion: 'interior', forma: 'rectangular' },
      { id: 7, numero: 'M7', estado: 'libre', capacidad: 2, ubicacion: 'interior', forma: 'cuadrada' },
      { id: 8, numero: 'M8', estado: 'ocupada', capacidad: 4, tiempo: '00:30', ubicacion: 'terraza', forma: 'redonda' },
      { id: 9, numero: 'M9', estado: 'libre', capacidad: 2, ubicacion: 'interior', forma: 'cuadrada' },
      { id: 10, numero: 'M10', estado: 'reservada', capacidad: 6, tiempo: '20:00', ubicacion: 'terraza', forma: 'rectangular' },
      { id: 11, numero: 'M11', estado: 'libre', capacidad: 4, ubicacion: 'interior', forma: 'cuadrada' },
      { id: 12, numero: 'M12', estado: 'ocupada', capacidad: 2, tiempo: '00:20', ubicacion: 'interior', forma: 'redonda' },
    ];
  }

  private readonly posicionesMesas: Record<number, { x: number; y: number }> = {
    1: { x: 50, y: 50 },
    2: { x: 150, y: 50 },
    3: { x: 250, y: 50 },
    4: { x: 50, y: 150 },
    5: { x: 150, y: 150 },
    6: { x: 250, y: 150 },
    7: { x: 50, y: 250 },
    8: { x: 150, y: 250 },
    9: { x: 250, y: 250 },
    10: { x: 350, y: 50 },
    11: { x: 350, y: 150 },
    12: { x: 350, y: 250 },
  };

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'libre': return 'Libre';
      case 'ocupada': return 'Ocupada';
      case 'reservada': return 'Reservada';
      case 'pendiente': return 'Pendiente';
      default: return '';
    }
  }

  getEstadoIcono(estado: string): string {
    switch (estado) {
      case 'libre': return 'checkmark-circle-outline';
      case 'ocupada': return 'people-outline';
      case 'reservada': return 'calendar-outline';
      case 'pendiente': return 'alert-circle-outline';
      default: return 'help-outline';
    }
  }

  getIconoMesa(mesa: Mesa): string {
    if (mesa.forma === 'redonda') return 'radio-button-off-outline';
    if (mesa.forma === 'rectangular') return 'rectangle-outline';
    return 'square-outline';
  }

  cambiarEstado(mesa: Mesa): void {
    const elemento = document.getElementById(`mesa-${mesa.id}`);
    if (elemento) {
      elemento.classList.add('estado-cambiando');
      setTimeout(() => elemento.classList.remove('estado-cambiando'), 500);
    }

    if (mesa.estado === 'libre') {
      mesa.estado = 'ocupada';
      mesa.tiempo = '00:00';

      this.iniciarTemporizador(mesa);
    } else {
      mesa.estado = 'libre';
      mesa.tiempo = undefined;
      this.detenerTemporizador(mesa);
    }
  }

  iniciarTemporizador(mesa: Mesa): void {
    this.detenerTemporizador(mesa);

    let minutos = 0;
    let segundos = 0;

    const temporizador = setInterval(() => {
      segundos++;
      if (segundos >= 60) {
        segundos = 0;
        minutos++;
      }

      const minutosStr = minutos.toString().padStart(2, '0');
      const segundosStr = segundos.toString().padStart(2, '0');
      mesa.tiempo = `${minutosStr}:${segundosStr}`;
    }, 1000);

    this.temporizadores.set(mesa.id, temporizador);
  }

  detenerTemporizador(mesa: Mesa): void {
    if (this.temporizadores.has(mesa.id)) {
      clearInterval(this.temporizadores.get(mesa.id));
      this.temporizadores.delete(mesa.id);
    }
  }

  ngOnDestroy(): void {
    this.temporizadores.forEach(temporizador => clearInterval(temporizador));
    this.temporizadores.clear();
  }

  verPedido(mesa: Mesa): void {
    console.log('Ver pedido de la mesa:', mesa.numero);
    // Implementar navegación al pedido
  }

  getMesasPorEstado(estado: string): Mesa[] {
    return this.mesas.filter(mesa => mesa.estado === estado);
  }

  getMesasPorUbicacion(ubicacion: string): Mesa[] {
    return this.mesas.filter(mesa => mesa.ubicacion === ubicacion);
  }

  getMesasFiltradas(): Mesa[] {
    return this.mesas.filter(mesa => {
      // Filtrar por estado
      if (this.filtroEstado !== 'todos' && mesa.estado !== this.filtroEstado) {
        return false;
      }

      if (this.filtroCapacidad > 0) {
        if (this.filtroCapacidad === 8 && mesa.capacidad < 8) {
          return false;
        } else if (this.filtroCapacidad !== 8 && mesa.capacidad !== this.filtroCapacidad) {
          return false;
        }
      }

      return true;
    });
  }

  cambiarVista(vista: 'grid' | 'list'): void {
    this.vistaActual = vista;
  }

  seleccionarMesa(mesa: Mesa): void {
    this.mesaSeleccionada = mesa;
  }

  getTooltipContent(mesa: Mesa): string {
    let content = `Mesa ${mesa.numero} - ${this.getEstadoTexto(mesa.estado)}`;
    content += `\nCapacidad: ${mesa.capacidad} personas`;
    if (mesa.tiempo) {
      content += `\nTiempo: ${mesa.tiempo}`;
    }
    content += `\nUbicación: ${mesa.ubicacion === 'interior' ? 'Interior' : 'Terraza'}`;
    return content;
  }

  getMesaPosicionX(mesa: Mesa): number {
    return this.posicionesMesas[mesa.id]?.x || 0;
  }

  getMesaPosicionY(mesa: Mesa): number {
    return this.posicionesMesas[mesa.id]?.y || 0;
  }

  ajustarZoom(delta: number): void {
    this.escalaZoom = Math.max(0.5, Math.min(2, this.escalaZoom + delta));
  }

  resetearZoom(): void {
    this.escalaZoom = 1;
  }

  getMesasFiltradasMapa(): Mesa[] {
    if (this.vistaMapa === 'todos') {
      return this.mesas;
    }
    return this.mesas.filter(mesa => mesa.ubicacion === this.vistaMapa);
  }

  getMesaTamanioAlto(mesa: Mesa): number {
    if (mesa.forma === 'rectangular') {
      return this.getMesaTamanio(mesa) * 0.7;
    }
    return this.getMesaTamanio(mesa);
  }

  getMesaTamanio(mesa: Mesa): number {
    const tamanioBase = 60;
    const incremento = Math.floor(mesa.capacidad / 2) * 10;

    if (mesa.forma === 'rectangular') {
      return tamanioBase + incremento + 20;
    }

    return tamanioBase + incremento;
  }
}
