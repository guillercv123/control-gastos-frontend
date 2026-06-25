import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal<string | null>(null);
  cargando = signal(false);

  async entrar(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    const res = await this.auth.iniciarSesion(this.email, this.password);
    this.cargando.set(false);

    if (res.ok) {
      this.router.navigate(['/dashboard']);
    } else if (res.requiereNuevaPassword) {
      this.error.set('Tu usuario requiere cambiar la contrase\u00f1a (lo agregamos como paso aparte).');
    } else {
      this.error.set(res.error ?? 'No se pudo iniciar sesi\u00f3n');
    }
  }
}
