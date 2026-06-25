import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private auth = inject(AuthService);
  async salir(): Promise<void> {
    await this.auth.cerrarSesion();
    location.href = '/login';
  }
}
