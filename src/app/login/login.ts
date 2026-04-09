import { Component, inject, signal } from '@angular/core';
import { AppLogo } from '../shared/logo/logo';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../auth/auth.service';

type AuthMode = 'signin' | 'signup' | 'reset';

@Component({
  selector: 'app-login',
  imports: [
    AppLogo,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  mode = signal<AuthMode>('signin');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  hidePassword = signal(true);
  hideConfirm = signal(true);

  form: FormGroup = this.buildForm('signin');

  setMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.error.set(null);
    this.success.set(null);
    this.form = this.buildForm(mode);
  }

  togglePassword(): void {
    this.hidePassword.update((v) => !v);
  }

  toggleConfirm(): void {
    this.hideConfirm.update((v) => !v);
  }

  async signInWithGoogle(): Promise<void> {
    await this.run(() => this.auth.signInWithGoogle());
  }

  async submitEmail(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password, displayName } = this.form.value;

    if (this.mode() === 'signin') {
      await this.run(() => this.auth.signInWithEmail(email, password));
    } else if (this.mode() === 'signup') {
      await this.run(() => this.auth.signUpWithEmail(email, password, displayName ?? ''));
    } else {
      await this.run(async () => {
        await this.auth.sendPasswordReset(email);
        this.success.set('Password reset email sent — check your inbox.');
      });
    }
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await action();
    } catch (err: unknown) {
      this.error.set(this.friendlyError(err));
    } finally {
      this.loading.set(false);
    }
  }

  private buildForm(mode: AuthMode): FormGroup {
    const base = {
      email: ['', [Validators.required, Validators.email]],
    };
    if (mode === 'reset') return this.fb.group(base);
    return this.fb.group({
      ...base,
      ...(mode === 'signup' ? { displayName: ['', Validators.required] } : {}),
      password: ['', [Validators.required, Validators.minLength(6)]],
      ...(mode === 'signin' ? { rememberMe: [false] } : {}),
    });
  }

  private friendlyError(err: unknown): string {
    if (!(err instanceof Error)) return 'Something went wrong. Please try again.';
    const code = (err as { code?: string }).code ?? '';
    const map: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    };
    return map[code] ?? err.message;
  }
}
