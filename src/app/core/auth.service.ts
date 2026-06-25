import { Injectable, signal } from '@angular/core';
import {
  signIn,
  signOut,
  fetchAuthSession,
  getCurrentUser,
  type AuthUser,
} from 'aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly usuario = signal<AuthUser | null>(null);

  async iniciarSesion(
    email: string,
    password: string,
  ): Promise<{ ok: boolean; requiereNuevaPassword?: boolean; error?: string }> {
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });

      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        return { ok: false, requiereNuevaPassword: true };
      }
      if (isSignedIn) {
        this.usuario.set(await getCurrentUser());
        return { ok: true };
      }
      return { ok: false, error: 'No se pudo completar el inicio de sesion' };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }

  async cerrarSesion(): Promise<void> {
    await signOut();
    this.usuario.set(null);
  }

  async tokenId(): Promise<string | null> {
    const { tokens } = await fetchAuthSession();
    return tokens?.idToken?.toString() ?? null;
  }

  async estaAutenticado(): Promise<boolean> {
    try {
      const { tokens } = await fetchAuthSession();
      return !!tokens?.idToken;
    } catch {
      return false;
    }
  }

  async cargarUsuario(): Promise<void> {
    try {
      this.usuario.set(await getCurrentUser());
    } catch {
      this.usuario.set(null);
    }
  }
}
