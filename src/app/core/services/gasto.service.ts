import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Gasto, CrearGasto, ActualizarGasto, FiltrosGasto } from '../models/gasto.model';

@Injectable({ providedIn: 'root' })
export class GastoService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/gastos`;

  listar(filtros: FiltrosGasto = {}): Observable<Gasto[]> {
    let params = new HttpParams();
    if (filtros.mes) params = params.set('mes', filtros.mes);
    if (filtros.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros.metodo) params = params.set('metodo', filtros.metodo);
    // El backend responde { total, gastos }; aqui devolvemos solo el arreglo.
    return this.http
      .get<{ total: number; gastos: Gasto[] }>(this.base, { params })
      .pipe(map((r) => r.gastos));
  }

  obtener(id: string): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.base}/${id}`);
  }

  crear(input: CrearGasto): Observable<Gasto> {
    return this.http.post<Gasto>(this.base, input);
  }

  actualizar(id: string, cambios: ActualizarGasto): Observable<Gasto | null> {
    // El backend envuelve la respuesta en { gastoUpdated }.
    return this.http
      .patch<{ gastoUpdated: Gasto | null }>(`${this.base}/${id}`, cambios)
      .pipe(map((r) => r.gastoUpdated));
  }

  eliminar(id: string): Observable<void> {
    return this.http
      .delete<{ id: string; eliminado: boolean }>(`${this.base}/${id}`)
      .pipe(map(() => undefined));
  }
}
