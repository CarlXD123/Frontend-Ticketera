// src/app/tasks/task-detail/task-detail.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.css']
})
export class TaskDetail {

  @Input() task: any; // recibir ticket desde parent
  loading = false;
  statuses = ['Nuevo', 'En Proceso', 'Resuelto', 'Cancelado'];

  constructor(private api: ApiService) {}

  actualizarTicket() {
    if (!this.task) return;

    this.loading = true;

    this.api.updateTicket(this.task.id, this.task).subscribe({
      next: res => {
        this.loading = false;
        alert('Ticket actualizado correctamente');
      },
      error: err => {
        this.loading = false;
        alert('Error al actualizar ticket');
      }
    });
  }
  
}