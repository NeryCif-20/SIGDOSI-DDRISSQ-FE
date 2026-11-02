import { Component, inject, signal } from '@angular/core';
import { FormRoot, FormField, form, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { LoginData } from '../../types/auth-types';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { ErrorHandler } from '../../../../shared/services/error-handler';
import { Router } from '@angular/router';
import { PasswordInput } from '../../../../shared/components/password-input/password-input';

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
  private readonly authService = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandler);

  private readonly _isRequesting = signal(false);
  private readonly loginModel = signal<LoginData>({
    password: '',
  });

  private readonly isRequesting = this._isRequesting.asReadonly();
  protected readonly loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.password, { message: 'La contraseña es obligatoria' });
    },
    {
      submission: {
        action: async (form) => {
          try {
            await firstValueFrom(this.authService.login(form().value()));
            this.router.navigateByUrl('/', {
              replaceUrl: true,
            });
          } catch (error) {
            this.errorHandler.handle(error);
          }
        },
      },
    },
  );

  protected requestPasswordMail() {
    this._isRequesting.set(true);
    this.authService.requestForgotPasswordMail().subscribe({
      error: this.errorHandler.handle,
      complete: () => this._isRequesting.set(false),
    });
  }
}
