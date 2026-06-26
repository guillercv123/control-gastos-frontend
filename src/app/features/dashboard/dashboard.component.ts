import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ResumenService } from '../../core/services/resumen.service';
import { GastoService } from '../../core/services/gasto.service';
import { Resumen } from '../../core/models/resumen.model';
import { Gasto } from '../../core/models/gasto.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private resumenService = inject(ResumenService);
  private gastoService = inject(GastoService);

  mes = new Date().toISOString().slice(0, 7);
  resumen = signal<Resumen | null>(null);
  recientes = signal<Gasto[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  // --- grafico de dona: la circunferencia de un radio 40 ---
  private readonly CIRC = 2 * Math.PI * 40;
  dashHormiga = computed(() => {
    const pct = this.resumen()?.porcentajeHormiga ?? 0;
    const arco = (pct / 100) * this.CIRC;
    return `${arco.toFixed(1)} ${this.CIRC.toFixed(1)}`;
  });

  // --- barras por categoria: ordenadas desc, ancho relativo al maximo ---
  categorias = computed(() => {
    const pc = this.resumen()?.porCategoria ?? {};
    const entradas = Object.entries(pc).sort((a, b) => b[1] - a[1]);
    const max = entradas.length ? entradas[0][1] : 0;
    return entradas.map(([nombre, monto]) => ({
      nombre,
      monto,
      pct: max > 0 ? Math.round((monto / max) * 100) : 0,
    }));
  });

  resto = computed(() => {
    const r = this.resumen();
    return r ? Math.round((r.totalGastado - r.totalHormiga) * 100) / 100 : 0;
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.resumenService.obtener(this.mes).subscribe({
      next: (r) => {
        this.resumen.set(r);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el resumen');
        this.cargando.set(false);
      },
    });
    this.gastoService.listar({ mes: this.mes }).subscribe({
      next: (g) => this.recientes.set(g.slice(0, 5)),
      error: () => this.recientes.set([]),
    });
  }

  soles(n: number | undefined): string {
    return 'S/ ' + (n ?? 0).toFixed(2);
  }

  async salir(): Promise<void> {
    await this.auth.cerrarSesion();
    location.href = '/login';
  }
}
