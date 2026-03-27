import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { TopbarComponent } from '../../layout/components/topbar/topbar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {

  user = {
    nombre: '',
    email: '',
    password: '',
    roleId: 0
  };

  roles: { id: number; nombre: string }[] = [];
  showPassword = false;
  loading = false;

  // Variables para el toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.api.getRoles().subscribe({
      next: (data: any[]) => {
        this.roles = data.map(r => ({ id: r.id, nombre: r.nombre }));

        if (this.roles.length > 0) {
          this.user.roleId = this.roles[0].id;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error cargando roles', err)
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToast = false;
    }, duration);
  }

  register() {
    this.loading = true;

    // 🔹 Guardar el roleId actual
    const currentRoleId = this.user.roleId;

    this.api.register(this.user).subscribe({
      next: () => {
        this.loading = false;

        // mostrar toast
        this.showToastMessage('Usuario registrado correctamente', 'success');

        // limpiar solo los campos de texto, manteniendo el rol
        this.user.nombre = '';
        this.user.email = '';
        this.user.password = '';
        this.user.roleId = currentRoleId;

        this.cdr.detectChanges(); // forzar actualización de ngModel
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al crear usuario:', err);
        this.showToastMessage('Error al crear usuario', 'error');
      }
    });
  }
}