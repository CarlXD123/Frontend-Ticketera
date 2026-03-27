import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:5221/api';

  constructor(private http: HttpClient) {}

  // 🔐 LOGIN
  login(data: any) {
    return this.http.post(`${this.baseUrl}/usuario/login`, data);
  }

  // ✨ Función interna para enviar headers con token
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
  createTicket(ticket: any) {
    return this.http.post(`${this.baseUrl}/ticket`, ticket, this.authHeaders());
  }

  // ✏️ ACTUALIZAR TICKET
  updateTicket(id: number, ticket: any) {
    return this.http.put(`${this.baseUrl}/ticket/${id}`, ticket, this.authHeaders());
  }

  // ❌ ELIMINAR TICKET con token
  deleteTicket(id: number) {
    return this.http.delete(`${this.baseUrl}/ticket/${id}`, this.authHeaders());
  }

  // 🧑‍💻 REGISTRAR USUARIO (si requiere token para admin)
  register(data: any) {
    return this.http.post(`${this.baseUrl}/usuario/register`, data, this.authHeaders());
  }

  // 🎭 OBTENER TODOS LOS ROLES
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rol`);
  }

  // 🧑‍💻 OBTENER TODOS LOS USUARIOS
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuario/list`);
  }
  
}