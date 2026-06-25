export interface Resumen {
  periodo: string;
  cantidad: number;
  cantidadHormiga: number;
  totalGastado: number;
  totalHormiga: number;
  porcentajeHormiga: number;
  proyeccionAnualHormiga: number;
  porCategoria: Record<string, number>;
  porMetodoPago: Record<string, number>;
}
