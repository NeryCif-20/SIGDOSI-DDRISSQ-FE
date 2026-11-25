import { Component, inject, linkedSignal } from '@angular/core';
import { FormRoot, FormField, form, pattern, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { PasswordInput } from '../../../../../../shared/components/password-input/password-input';
import { Router } from '@angular/router';
import { SetupPasswordData } from '../../../../types/auth-types';
import { matchFields } from '../../../../../../shared/validations/match-fields-validator';
import { PASSWORD_PATTERN } from '../../../../../../shared/validations/patterns';
import { toast } from '@spartan-ng/brain/sonner';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../services/auth-service';
import { SetupPasswordStore } from '../../store/setup-password-store';
import { injectMutation } from '@tanstack/angular-query';

@Component({
  imports: [
    HlmFieldImports,
    HlmButtonImports,
    HlmSpinnerImports,
    FormRoot,
    FormField,
    PasswordInput,
  ],
  selector: 'sigdosi-auth-password-form',
  styles: ``,
  templateUrl: './password-form.html',
})
export class PasswordForm {
  private readonly router = inject(Router);
  private readonly setupPasswordStore = inject(SetupPasswordStore);
  private readonly authService = inject(AuthService);

  private readonly setupPasswordModel = linkedSignal<SetupPasswordData>(() => ({
    token: this.setupPasswordStore.token(),
    newPassword: '',
    confirmNewPassword: '',
  }));

  private readonly setupPasswordMutation = injectMutation(() => ({
    mutationFn: (data: SetupPasswordData) => firstValueFrom(this.authService.setupPassword(data)),
    onSuccess: async () => {
      const navigationResult = await this.router.navigateByUrl('/', { replaceUrl: true });
      if (navigationResult) {
        toast.success(this.authService.user()!.firstName, {
          description: 'Bienvenido!!!',
        });
      }
    },
    onError: () => this.setupPasswordStore.markTokenAsInvalid(),
  }));

  protected readonly setupPasswordForm = form(
    this.setupPasswordModel,
    (path) => {
      required(path.newPassword, { message: 'La contraseña es obligatoria' });
      pattern(path.newPassword, PASSWORD_PATTERN, {
        message: 'Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo.',
      });
      matchFields(path.confirmNewPassword, path.newPassword, {
        message: 'Las contraseñas no coinciden',
      });
    },
    {
      submission: {
        action: async (form) => {
          await this.setupPasswordMutation.mutateAsync(form().value());
        },
      },
    },
  );
}
