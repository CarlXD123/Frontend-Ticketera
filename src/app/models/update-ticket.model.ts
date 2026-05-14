import { EstadoTicket } from '../enums/estado-ticket.enum';

export interface UpdateTicketRequest {
  titulo: string;
  descripcion: string;
  responsableId: number;
  estado: EstadoTicket;
}