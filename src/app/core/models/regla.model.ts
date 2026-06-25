export interface Regla {
  id: string;
  userId: string;
  keyword: string;
  categoria: string;
  createdAt: string;
}

export interface CrearRegla {
  keyword: string;
  categoria: string;
}

export interface Sugerencia {
  categoria: string | null;
  reglaId?: string;
}
