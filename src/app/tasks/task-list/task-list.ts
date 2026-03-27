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
  tasksByStatus: { [key: number]: any[] } = {};
  selectedTask: any = null;

  // =========================
  // FILTROS
  // =========================
  searchTerm = '';
  statusFilter: number | null = null;
  showDeleteModal = false;
  taskToDeleteId: number | null = null;

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
    this.statuses.forEach(s => this.columnPages[s.value] = 1);
    this.loadTickets();
    this.loadUsuarios();
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
    this.api.getTickets().subscribe({
      next: (data: any) => {

        console.log('DATA API:', data); 

        this.tasks = data.map((t: any) => ({
          ...t,
          estado: this.mapEstadoToNumber(t.estado),
          responsableNombre: t.responsableNombre || `Usuario ${t.responsableId}`
        }));

        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando tickets', err)
    });
  }

  // =========================
  // FILTROS
  // =========================
  applyFilters() {
    const filtered = this.tasks.filter(task => {
      const matchesSearch = task.titulo?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter !== null ? task.estado === this.statusFilter : true;
      return matchesSearch && matchesStatus;
    });

    this.tasksByStatus = this.statuses.reduce((acc, status) => {
      acc[status.value] = filtered.filter(t => t.estado === status.value);
      return acc;
    }, {} as { [key: number]: any[] });

    this.statuses.forEach(s => this.columnPages[s.value] = 1);
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
    this.selectedTask = { ...task }; // 🔥 CLAVE
  }

  closeDetail() {
    this.selectedTask = null;
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

    console.log('ENVIANDO:', payload);

    this.updateLocalTask(task);

    this.api.updateTicket(task.id, payload).subscribe({
      next: () => {
        console.log('OK');

     
        this.selectedTask = null;
        this.tasks = [];
        this.tasksByStatus = {};

        setTimeout(() => {
          this.loadTickets(); 
        }, 50);
      },
      error: (err) => {
        console.log('ERROR BACKEND:', err.error.errors);
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
}