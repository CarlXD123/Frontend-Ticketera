import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

export enum EstadoTicket {
  Nuevo = 0,
  EnProceso = 1,
  Resuelto = 2,
  Cancelado = 3
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList implements OnInit {

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  // =========================
  // DATOS
  // =========================
  tasks: any[] = [];
  usuarios: any[] = [];
  comentarios: any[] = [];
  loadingComentarios: { [key: number]: boolean } = {};
  comentariosPorTicket: { [key: number]: any[] } = {};
  comentarioEditandoId: number | null = null;
  textoEditando: string = '';
  nuevoComentario: string = '';
  tasksByStatus: { [key: number]: any[] } = {};
  selectedTask: any = null;

  // =========================
  // FILTROS
  // =========================
  searchTerm = '';
  statusFilter: number | null = null;
  showDeleteModal = false;
  taskToDeleteId: number | null = null;
  userFilter: number | null = null;

  // =========================
  // PAGINACIÓN
  // =========================
  pageSize = 6;
  columnPages: { [key: number]: number } = {};

  // =========================
  // ESTADOS
  // =========================
  statuses = [
    { label: 'Nuevo', value: EstadoTicket.Nuevo },
    { label: 'En Proceso', value: EstadoTicket.EnProceso },
    { label: 'Resuelto', value: EstadoTicket.Resuelto },
    { label: 'Cancelado', value: EstadoTicket.Cancelado }
  ];

  ngOnInit() {
    console.log('🔥 COMPONENTE INICIADO');
    const token = localStorage.getItem('token');

    console.log(token)

    if (!token) {
      console.log('No hay token, redirigir a login');
      return;
    }

    this.loadUsuarios();
    this.loadTickets();
  }

  mapEstadoToNumber(estado: any): number {
    switch (estado) {
      case 'Nuevo': return 0;
      case 'EnProceso': return 1;
      case 'Resuelto': return 2;
      case 'Cancelado': return 3;
      case 0:
      case 1:
      case 2:
      case 3:
        return estado;
      default:
        return 0;
    }
  }

  // =========================
  // CARGA API
  // =========================
  loadTickets() {
    const savedTaskId = localStorage.getItem('selectedTaskId');

    this.api.getTickets().subscribe({
      next: (data: any) => {

        console.log('📦 DATA BACKEND:', data);

        // 🔥 PROTECCIÓN
        if (!Array.isArray(data)) {
          console.error('❌ DATA NO ES ARRAY:', data);
          this.tasks = [];
          return;
        }

        this.tasks = data.map((t: any) => ({
          ...t,
          estado: this.mapEstadoToNumber(t.estado),
          responsableNombre: t.responsableNombre || `Usuario ${t.responsableId}`
        }));

        this.applyFilters();

        if (savedTaskId) {
          const id = Number(savedTaskId);
          const task = this.tasks.find(t => Number(t.id) === id);

          if (task) {
            this.selectedTask = task;

            if (!this.comentariosPorTicket[id]) {
              this.loadComentarios(id);
            }
          }
        }

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('❌ ERROR CARGANDO TICKETS:', err);
      }
    });
  }

  loadComentarios(ticketId: number) {
    console.log(this.comentariosPorTicket)
    // 🔥 evita doble llamada
    if (this.loadingComentarios[ticketId]) return;

    this.loadingComentarios[ticketId] = true;

    this.api.getComentarios(ticketId).subscribe({
      next: (data: any) => {
        this.comentariosPorTicket[ticketId] = data || [];
        this.loadingComentarios[ticketId] = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingComentarios[ticketId] = false;
      }
    });
  }

  // =========================
  // FILTROS
  // =========================
  applyFilters() {
    const filtered = this.tasks.filter(task => {

      const matchesSearch =
        task.titulo?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.statusFilter !== null ? task.estado === this.statusFilter : true;

      const matchesUser =
        this.userFilter !== null ? task.responsableId === this.userFilter : true;

      return matchesSearch && matchesStatus && matchesUser;
    });

    const newTasksByStatus: { [key: number]: any[] } = {};

    this.statuses.forEach(status => {
      newTasksByStatus[status.value] =
        filtered.filter(t => t.estado === status.value);

      this.columnPages[status.value] = 1;
    });

    this.tasksByStatus = newTasksByStatus;

    this.cdr.detectChanges();
  }

  // =========================
  // PAGINACIÓN
  // =========================
  getTasksForColumn(status: number) {
    const page = this.columnPages[status] || 1;
    const start = (page - 1) * this.pageSize;
    return (this.tasksByStatus[status] || []).slice(start, start + this.pageSize);
  }

  getTaskCount(status: number) {
    return this.tasksByStatus[status]?.length || 0;
  }

  maxPage(status: number) {
    return Math.ceil(this.getTaskCount(status) / this.pageSize);
  }

  prevPage(status: number) {
    if (this.columnPages[status] > 1) {
      this.columnPages[status]--;
    }
  }

  nextPage(status: number) {
    if ((this.columnPages[status] || 1) < this.maxPage(status)) {
      this.columnPages[status]++;
    }
  }

  // =========================
  // UI
  // =========================
  getEstadoTexto(estado: number): string {
    switch (estado) {
      case 0: return 'Nuevo';
      case 1: return 'En Proceso';
      case 2: return 'Resuelto';
      case 3: return 'Cancelado';
      default: return '';
    }
  }

  // =========================
  // SELECCIÓN
  // =========================
  selectTask(task: any) {
    setTimeout(() => {
      this.selectedTask = { ...task };
    });
  }

  openDetail(task: any) {
    this.selectedTask = { ...task };

    localStorage.setItem('selectedTaskId', task.id);

    // 🔥 SOLO carga si NO existe en cache
    if (!this.comentariosPorTicket[task.id]) {
      this.loadComentarios(task.id);
    }
  }
  closeDetail() {
    this.selectedTask = null;
    localStorage.removeItem('selectedTaskId');
  }

  // =========================
  // UPDATE LOCAL
  // =========================
  updateLocalTask(task: any) {
    const oldEstado = this.tasks.find(t => t.id === task.id)?.estado;

    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks = [
        ...this.tasks.slice(0, index),
        { ...task },
        ...this.tasks.slice(index + 1)
      ];
    }

    if (oldEstado !== undefined && oldEstado !== task.estado) {
      this.tasksByStatus[oldEstado] = (this.tasksByStatus[oldEstado] || [])
        .filter(t => t.id !== task.id);

      this.tasksByStatus[task.estado] = [
        { ...task },
        ...(this.tasksByStatus[task.estado] || [])
      ];
    } else {
      this.tasksByStatus[task.estado] = (this.tasksByStatus[task.estado] || []).map(t =>
        t.id === task.id ? { ...task } : t
      );
    }

    this.cdr.detectChanges();
  }

  loadUsuarios() {
    this.api.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  // =========================
  // SAVE
  // =========================
  saveTask() {
    if (!this.selectedTask) return;

    const task = { ...this.selectedTask };

    const payload = {
      titulo: task.titulo || '',
      descripcion: task.descripcion || '',
      responsableId: Number(task.responsableId),
      estado: Number(task.estado)
    };

    this.updateLocalTask(task);

    // 🔥 cerrar modal BIEN
    this.selectedTask = null;
    localStorage.removeItem('selectedTaskId');

    this.api.updateTicket(task.id, payload).subscribe({
      next: () => {
        console.log('OK');
        this.loadTickets(); // ya no reabre
      },
      error: (err) => {
        console.log('ERROR BACKEND:', err);
        this.loadTickets();
      }
    });
  }

  confirmDeleteTask() {
    if (!this.selectedTask) return;

    this.taskToDeleteId = this.selectedTask.id;
    this.showDeleteModal = true;
  }

  deleteTaskConfirmed() {
    if (!this.taskToDeleteId) return;

    this.api.deleteTicket(this.taskToDeleteId).subscribe({
      next: () => {
        console.log('Eliminado');

        this.showDeleteModal = false;
        this.selectedTask = null;
        this.tasks = [];
        this.tasksByStatus = {};

        this.loadTickets();
      },
      error: (err) => {
        console.error('Error eliminando', err);
        alert('No se pudo eliminar');
      }
    });
  }

  agregarComentario() {
    if (!this.nuevoComentario.trim() || !this.selectedTask) return;
    console.log('TOKEN:', localStorage.getItem('token'));
    const comentario = {
      texto: this.nuevoComentario,
      ticketId: this.selectedTask.id
    };

    this.api.createComentario(comentario).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.loadComentarios(this.selectedTask.id); 
      },
      error: (err) => {
        console.log('STATUS:', err.status);
        console.log('ERROR BODY:', err.error);
        console.log('FULL ERROR:', err);
      }
    });
  }

  eliminarComentario(id: number) {
    this.api.deleteComentario(id).subscribe({
      next: () => {
        this.loadComentarios(this.selectedTask.id);
      }
    });
  }

  editarComentario(c: any) {
    this.comentarioEditandoId = c.id;
    this.textoEditando = c.texto;
  }

  guardarComentarioEditado(c: any) {
    const payload = {
      texto: this.textoEditando
    };

    this.api.updateComentario(c.id, payload).subscribe({
      next: () => {

        const ticketId = this.selectedTask.id;

        this.comentariosPorTicket[ticketId] =
          this.comentariosPorTicket[ticketId].map((item: any) =>
            item.id === c.id
              ? { ...item, texto: this.textoEditando } // ✅ nuevo objeto
              : item
          );

        this.comentarioEditandoId = null;
        this.textoEditando = '';

        this.cdr.detectChanges(); // 🔥 fuerza refresco inmediato
      }
    });
  }

  cancelarEdicion() {
    this.comentarioEditandoId = null;
    this.textoEditando = '';
  }
}