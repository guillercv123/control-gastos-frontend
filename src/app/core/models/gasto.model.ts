export type MetodoPago = 'yape' | 'plin' | 'efectivo' | 'tarjeta' | 'otro';
export const METODOS_PAGO: MetodoPago[] = ['yape', 'plin', 'efectivo', 'tarjeta', 'otro'];

export interface Gasto {
  id: string;
  userId: string;
  monto: number;
  categoria: string;
  metodoPago: MetodoPago;
  fecha: string;            // YYYY-MM-DD
  comercio: string | null;
  descripcion: string | null;
  esHormiga: boolean;
  reciboKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrearGasto {
  monto: number;
  categoria: string;
  metodoPago: MetodoPago;
  fecha: string;
  comercio?: string;
  descripcion?: string;
}

export type ActualizarGasto = Partial<CrearGasto>;

export interface FiltrosGasto {
  mes?: string;        // YYYY-MM
  categoria?: string;
  metodo?: string;     // OJO: el backend espera 'metodo', no 'metodoPago'
}
