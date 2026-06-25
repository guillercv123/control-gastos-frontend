import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReglaService } from '../../core/services/regla.service';
import { Regla } from '../../core/models/regla.model';

@Component({
  selector: 'app-reglas',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reglas.component.html',
  styleUrl: './reglas.component.css',
})
export class ReglasComponent {
  private reglaService = inject(ReglaService);

  reglas = signal<Regla[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  // formulario de alta
  keyword = '';
  categoria = '';
  agregando = signal(false);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.reglaService.listar().subscribe({
      next: (reglas) => {
        this.reglas.set(reglas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las reglas');
        this.cargando.set(false);
      },
    });
  }

  agregar(): void {
    const keyword = this.keyword.trim();
    const categoria = this.categoria.trim();
    if (!keyword || !categoria) {
      this.error.set('Completa la palabra clave y la categoria');
      return;
    }
    this.error.set(null);
    this.agregando.set(true);
    this.reglaService.crear({ keyword, categoria }).subscribe({
      next: (regla) => {
        this.reglas.update((lista) => [...lista, regla]);
        this.keyword = '';
        this.categoria = '';
        this.agregando.set(false);
      },
      error: () => {
        this.error.set('No se pudo crear la regla');
        this.agregando.set(false);
      },
    });
  }

  eliminar(regla: Regla): void {
    if (!confirm(`Eliminar la regla "${regla.keyword} -> ${regla.categoria}"?`)) return;
    this.reglaService.eliminar(regla.id).subscribe({
      next: () => this.reglas.update((lista) => lista.filter((r) => r.id !== regla.id)),
      error: () => this.error.set('No se pudo eliminar la regla'),
    });
  }
}
