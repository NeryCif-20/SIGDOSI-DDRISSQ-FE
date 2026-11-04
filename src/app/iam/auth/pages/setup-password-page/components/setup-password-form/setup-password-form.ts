import { Component, inject, linkedSignal } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { SetupPasswordData } from '../../../../types/auth-types';
import { form, FormField, FormRoot, pattern, required } from '@angular/forms/signals';
import { matchFields } from '../../../../../../shared/validations/match-fields-validator';
import { PASSWORD_PATTERN } from '../../../../../../shared/validations/patterns';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { PasswordInput } from '../../../../../../shared/components/password-input/password-input';
import { toast } from '@spartan-ng/brain/sonner';

@Component({
  imports: [
    HlmFieldImports,
    HlmButtonImports,
    HlmSpinnerImports,
    FormRoot,
    FormField,
    PasswordInput,
  ],
  selector: 'sigdosi-auth-setup-password-form',
  styles: ``,
  templateUrl: './setup-password-form.html',
})
export class SetupPasswordForm {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly token = toSignal(
    this.activatedRoute.queryParamMap.pipe(map((params) => params.get('token')!)),
    {
      requireSync: true,
    },
  );
  private readonly setupPasswordModel = linkedSignal<SetupPasswordData>(() => ({
    token: this.token(),
    newPassword: '',
    confirmNewPassword: '',
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
          await firstValueFrom(this.authService.setupPassword(form().value()))
            .then(() => {
              this.router
                .navigateByUrl('/', {
                  replaceUrl: true,
                })
                .then((result) => {
                  if (result) {
                    toast.success(`Bienvenido`);
                  }
                });
            })
            .catch(() => undefined);
        },
      },
    },
  );
}
