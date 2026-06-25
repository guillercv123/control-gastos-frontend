import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Regla, CrearRegla, Sugerencia } from '../models/regla.model';

@Injectable({ providedIn: 'root' })
export class ReglaService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/reglas`;

  listar(): Observable<Regla[]> {
    return this.http
      .get<{ total: number; reglas: Regla[] }>(this.base)
      .pipe(map((r) => r.reglas));
  }

  crear(input: CrearRegla): Observable<Regla> {
    return this.http.post<Regla>(this.base, input);
  }

  eliminar(id: string): Observable<void> {
    return this.http
      .delete<{ id: string; eliminado: boolean }>(`${this.base}/${id}`)
      .pipe(map(() => undefined));
  }

  // Devuelve { categoria, reglaId? }; categoria puede ser null si no hay coincidencia.
  sugerir(comercio?: string, descripcion?: string): Observable<Sugerencia> {
    return this.http.post<Sugerencia>(`${this.base}/sugerir`, { comercio, descripcion });
  }
}
