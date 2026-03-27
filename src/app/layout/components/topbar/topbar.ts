import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent implements OnInit {

  user = {
    name: 'Usuario',
    avatar: ''
  };

  // 🔽 estado del menú
  menuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      // ❌ No hay token → ir al login
      this.router.navigate(['/']);
      return;
    }

    // ⚡ Decodificar JWT
    const payload = this.parseJwt(token);
    const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Usuario';
    const firstLetter = username.charAt(0).toUpperCase();

    this.user.name = username;
    this.user.avatar = `https://ui-avatars.com/api/?name=${firstLetter}&background=random`;
  }

  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload;
    } catch (e) {
      console.error('Error decodificando JWT', e);
      return null;
    }
  }

  // 🔘 abrir/cerrar menú
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // ➕ ir a registro
  goToRegister() {
    this.menuOpen = false;
    this.router.navigate(['/register']);
  }

  // 🚪 logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // opcional, limpiar nombre
    this.router.navigate(['/']);
    this.menuOpen = false;
  }

  goToTasks() {
    this.router.navigate(['/tasks']);
    this.menuOpen = false; 
  }

  showTasksButton(): boolean {
    return this.router.url !== '/tasks';
  }

  openCreateTicket() {
    this.router.navigate(['/tasks/register']);
  }
}