import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UrlSubida {
  uploadUrl: string;
  key: string;
  expiraEn: number;
}

@Injectable({ providedIn: 'root' })
export class ImportacionService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/importaciones`;

  // 1) Pide la URL firmada. Va a TU API -> el interceptor le pone el token.
  obtenerUrl(filename: string): Observable<UrlSubida> {
    const params = new HttpParams().set('filename', filename);
    return this.http.get<UrlSubida>(`${this.base}/url`, { params });
  }

  // 2) Sube el archivo DIRECTO a S3 con la URL firmada.
  //    Ese PUT NO lleva token (la URL ya trae su propia firma) y el interceptor
  //    no lo toca porque su dominio no es el de environment.apiUrl.
  subirArchivo(file: File): Observable<UrlSubida> {
    return this.obtenerUrl(file.name).pipe(
      switchMap((info) =>
        this.http
          .put(info.uploadUrl, file, { observe: 'response', responseType: 'text' })
          .pipe(map(() => info)),
      ),
    );
  }
}
