import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImportacionService } from '../../core/services/importacion.service';

type Estado = 'idle' | 'subiendo' | 'exito' | 'error';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './importar.component.html',
  styleUrl: './importar.component.css',
})
export class ImportarComponent {
  private importacionService = inject(ImportacionService);

  archivo = signal<File | null>(null);
  estado = signal<Estado>('idle');
  error = signal<string | null>(null);

  seleccionar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.error.set(null);
    this.estado.set('idle');
    if (file && !/\.csv$/i.test(file.name)) {
      this.error.set('El archivo debe ser .csv');
      this.archivo.set(null);
      return;
    }
    this.archivo.set(file);
  }

  subir(): void {
    const file = this.archivo();
    if (!file) return;
    this.estado.set('subiendo');
    this.error.set(null);
    this.importacionService.subirArchivo(file).subscribe({
      next: () => this.estado.set('exito'),
      error: () => {
        this.estado.set('error');
        this.error.set('No se pudo subir el archivo. Intenta de nuevo.');
      },
    });
  }

  reiniciar(): void {
    this.archivo.set(null);
    this.estado.set('idle');
    this.error.set(null);
  }

  pesoKb(file: File): string {
    return (file.size / 1024).toFixed(1) + ' KB';
  }
}
