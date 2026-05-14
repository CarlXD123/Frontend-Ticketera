export interface Comment {
  id: number;
  texto: string;
  fechaCreacion: string; // o Date si lo parseas
  ticketId: number;
  usuarioId: number;
}