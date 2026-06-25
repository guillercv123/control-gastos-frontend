import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GastoService } from '../../core/services/gasto.service';
import { Gasto, METODOS_PAGO } from '../../core/models/gasto.model';

@Component({
  selector: 'app-gastos-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './gastos-list.component.html',
  styleUrl: './gastos-list.component.css',
})
export class GastosListComponent {
  private gastoService = inject(GastoService);

  gastos = signal<Gasto[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  // filtros
  mes = new Date().toISOString().slice(0, 7);
  categoria = '';
  metodo = '';
  readonly metodos = METODOS_PAGO;

  total = computed(() => this.gastos().length);
  totalMonto = computed(() => this.gastos().reduce((s, g) => s + g.monto, 0));

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.gastoService
      .listar({
        mes: this.mes || undefined,
        categoria: this.categoria || undefined,
        metodo: this.metodo || undefined,
      })
      .subscribe({
        next: (gastos) => {
          this.gastos.set(gastos);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los gastos');
          this.cargando.set(false);
        },
      });
  }

  limpiar(): void {
    this.categoria = '';
    this.metodo = '';
    this.cargar();
  }

  soles(n: number): string {
    return 'S/ ' + n.toFixed(2);
  }
}
