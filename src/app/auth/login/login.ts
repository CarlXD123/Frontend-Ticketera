import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class Login {

  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/tasks']);
      },
      error: () => {
        alert('Credenciales incorrectas');
      }
    });
  }
}