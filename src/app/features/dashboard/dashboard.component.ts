import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  async salir(): Promise<void> {
    await this.auth.cerrarSesion();
    location.href = '/login';
  }

  nuevoGasto(){
    this.router.navigate(['gastos/nuevo']);
  }
}
