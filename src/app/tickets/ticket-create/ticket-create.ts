import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-create.html',
  styleUrls: ['./ticket-create.css']
})
export class TicketCreate {

  ticket: any = {
    titulo: '',
    descripcion: '',
    responsableId: null
  };

  usuarios: any[] = [];

  loading = false;

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private api: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.api.getUsuarios().subscribe(users => {
      this.usuarios = users;
    });
  }

  crearTicket() {
    console.log('Registrando ticket:', this.ticket);

    if (!this.ticket.titulo || !this.ticket.responsableId) return;

    this.loading = true;
    this.mostrarToast('Creando ticket…', 'success'); // mensaje inmediato
    this.cd.detectChanges(); // ⬅ forzar UI a actualizar

    this.api.createTicket(this.ticket).subscribe({
      next: res => {
        this.loading = false;
        this.mostrarToast('Ticket creado correctamente', 'success');
        this.ticket = { titulo: '', descripcion: '', responsableId: null };
        this.cd.detectChanges(); // ⬅ forzar UI otra vez
      },
      error: err => {
        this.loading = false;
        this.mostrarToast('Error al crear ticket', 'error');
        console.error('Error al crear ticket:', err);
        this.cd.detectChanges(); // ⬅ forzar UI
      }
    });
  }

  mostrarToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => this.showToast = false, 3000);
  }
}