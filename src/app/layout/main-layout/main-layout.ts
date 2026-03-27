import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { TopbarComponent } from '../components/topbar/topbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TopbarComponent
  ], 
  templateUrl: './main-layout.html',
})
export class MainLayout {}