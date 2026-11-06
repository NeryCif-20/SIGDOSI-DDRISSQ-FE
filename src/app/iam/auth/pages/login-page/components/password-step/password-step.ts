import { Component, inject, signal } from '@angular/core';
import { FormRoot, FormField, form, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { firstValueFrom } from 'rxjs';
import { PasswordInput } from '../../../../../../shared/components/password-input/password-input';
import { AuthService } from '../../../../services/auth-service';
import { LoginData } from '../../../../types/auth-types';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { LoginStore } from '../../store/login-store';

@Component({
  imports: [
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmSpinnerImports,
    FormRoot,
    FormField,
    PasswordInput,
  ],
  selector: 'sigdosi-auth-password-step',
  styles: ``,
  templateUrl: './password-step.html',
})
export class PasswordStep {
  private readonly router = inject(Router);
  private readonly loginStore = inject(LoginStore);
  private readonly authService = inject(AuthService);

  private readonly _isRequesting = signal(false);
  private readonly loginModel = signal<LoginData>({
    password: '',
  });

  protected readonly isRequesting = this._isRequesting.asReadonly();
  protected readonly loginForm = form(
    this.loginModel,
    (path) => {
      required(path.password, { message: 'La contraseña es obligatoria' });
    },
    {
      submission: {
        action: async (form) => {
          try {
            await firstValueFrom(this.authService.login(form().value()));
            const result = await this.router.navigateByUrl('/', {
              replaceUrl: true,
            });
            if (result) {
              toast.success(this.authService.user()!.firstName, {
                description: 'Bienvenido!!!',
              });
            }
          } catch {
            return;
          }
        },
      },
    },
  );

  protected handleRequestForgotPasswordMail() {
    this._isRequesting.set(true);
    this.loginStore.requestForgotPasswordMail().subscribe({
      error: () => undefined,
      complete: () => this._isRequesting.set(false),
    });
  }
}
