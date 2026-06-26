import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resumen } from '../models/resumen.model';

@Injectable({ providedIn: 'root' })
export class ResumenService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/resumen`;

  // /resumen devuelve el objeto Resumen directo (sin envoltura).
  obtener(mes?: string): Observable<Resumen> {
    let params = new HttpParams();
    if (mes) params = params.set('mes', mes);
    return this.http.get<Resumen>(this.base, { params });
  }
}
