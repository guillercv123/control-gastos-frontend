import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GastoService } from '../../core/services/gasto.service';
import { ReglaService } from '../../core/services/regla.service';
import { CrearGasto, MetodoPago, METODOS_PAGO } from '../../core/models/gasto.model';

@Component({
  selector: 'app-gasto-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './gasto-form.component.html',
  styleUrl: './gasto-form.component.css',
})
export class GastoFormComponent {
  private gastoService = inject(GastoService);
  private reglaService = inject(ReglaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly metodos = METODOS_PAGO;
  readonly id = this.route.snapshot.paramMap.get('id');
  readonly esEdicion = !!this.id;

  // campos del formulario
  monto: number | null = null;
  fecha = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  comercio = '';
  descripcion = '';
  categoria = '';
  metodoPago: MetodoPago = 'yape';

  cargando = signal(false);
  guardando = signal(false);
  error = signal<string | null>(null);
  sugerencia = signal<string | null>(null);

  constructor() {
    if (this.esEdicion) this.cargarGasto();
  }

  private cargarGasto(): void {
    this.cargando.set(true);
    this.gastoService.obtener(this.id!).subscribe({
      next: (g) => {
        this.monto = g.monto;
        this.fecha = g.fecha;
        this.comercio = g.comercio ?? '';
        this.descripcion = g.descripcion ?? '';
        this.categoria = g.categoria;
        this.metodoPago = g.metodoPago;
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el gasto');
        this.cargando.set(false);
      },
    });
  }

  // Al salir del campo comercio/descripcion: pide una categoria sugerida.
  buscarSugerencia(): void {
    const comercio = this.comercio.trim();
    const descripcion = this.descripcion.trim();
    if (!comercio && !descripcion) {
      this.sugerencia.set(null);
      return;
    }
    this.reglaService.sugerir(comercio || undefined, descripcion || undefined).subscribe({
      next: (s) => {
        // Solo mostramos la sugerencia si aporta algo distinto a lo ya escrito.
        this.sugerencia.set(s.categoria && s.categoria !== this.categoria ? s.categoria : null);
      },
      error: () => this.sugerencia.set(null),
    });
  }

  aplicarSugerencia(): void {
    const s = this.sugerencia();
    if (s) {
      this.categoria = s;
      this.sugerencia.set(null);
    }
  }

  guardar(): void {
    this.error.set(null);
    if (this.monto === null || this.monto <= 0) {
      this.error.set('Ingresa un monto mayor que 0');
      return;
    }
    if (!this.categoria.trim()) {
      this.error.set('La categoria es obligatoria');
      return;
    }
    if (!this.fecha) {
      this.error.set('La fecha es obligatoria');
      return;
    }

    const datos: CrearGasto = {
      monto: this.monto,
      categoria: this.categoria.trim(),
      metodoPago: this.metodoPago,
      fecha: this.fecha,
      comercio: this.comercio.trim() || undefined,
      descripcion: this.descripcion.trim() || undefined,
    };

    this.guardando.set(true);
    const op = this.esEdicion
      ? this.gastoService.actualizar(this.id!, datos)
      : this.gastoService.crear(datos);

    op.subscribe({
      next: () => this.router.navigate(['/gastos']),
      error: () => {
        this.error.set('No se pudo guardar el gasto');
        this.guardando.set(false);
      },
    });
  }

  eliminar(): void {
    if (!this.esEdicion) return;
    if (!confirm('Eliminar este gasto? Esta accion no se puede deshacer.')) return;
    this.guardando.set(true);
    this.gastoService.eliminar(this.id!).subscribe({
      next: () => this.router.navigate(['/gastos']),
      error: () => {
        this.error.set('No se pudo eliminar el gasto');
        this.guardando.set(false);
      },
    });
  }
}
