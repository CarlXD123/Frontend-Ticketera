import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { CrearTicketRequest } from '../models/crear-ticket.model';
import { UpdateTicketRequest } from '../models/update-ticket.model';
import { RegisterUserRequest } from '../models/register-user.model';
import { User } from '../models/user.model';
import { CreateCommentRequest } from '../models/create-comment.model';
import { Comment } from '../models/comentario.model';
import { UpdateCommentRequest } from '../models/update-comment.model';
import { UpdateCommentResponse } from '../models/update-comment-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/usuario/login`,
      data
    );
  }

  private authHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // 🎫 OBTENER TODOS LOS TICKETS
  getTickets() {
    return this.http.get(`${this.baseUrl}/ticket`, this.authHeaders());
  }

  // ➕ CREAR TICKET
  createTicket(ticket: CrearTicketRequest) {
    return this.http.post(
      `${this.baseUrl}/ticket`,
      ticket,
      this.authHeaders()
    );
  }

  // ✏️ ACTUALIZAR TICKET
  updateTicket(id: number, ticket: UpdateTicketRequest) {
    return this.http.put(
      `${this.baseUrl}/ticket/${id}`,
      ticket,
      this.authHeaders()
    );
  }

  // ❌ ELIMINAR TICKET
  deleteTicket(id: number) {
    return this.http.delete(`${this.baseUrl}/ticket/${id}`, this.authHeaders());
  }

  // 🧑‍💻 REGISTRAR USUARIO
  register(data: RegisterUserRequest) {
    return this.http.post<User>(
      `${this.baseUrl}/usuario/register`,
      data,
      this.authHeaders()
    );
  }

  // 🎭 OBTENER TODOS LOS ROLES
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rol`);
  }

  // 🧑‍💻 OBTENER TODOS LOS USUARIOS
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuario/list`);
  }

  // 💬 OBTENER COMENTARIOS POR TICKET
  getComentarios(ticketId: number) {
    return this.http.get(`${this.baseUrl}/comentario/ticket/${ticketId}`, this.authHeaders());
  }

  // ➕ CREAR COMENTARIO
  createComentario(comentario: CreateCommentRequest) {
    return this.http.post<Comment>(
      `${this.baseUrl}/comentario`,
      comentario,
      this.authHeaders()
    );
  }

  // ❌ ELIMINAR COMENTARIO
  deleteComentario(id: number) {
    return this.http.delete(`${this.baseUrl}/comentario/${id}`, this.authHeaders());
  }

  // ✏️ ACTUALIZAR COMENTARIO
  updateComentario(id: number, comentario: UpdateCommentRequest) {
    return this.http.put<UpdateCommentResponse>(
      `${this.baseUrl}/comentario/${id}`,
      comentario,
      this.authHeaders()
    );
  }
  
}