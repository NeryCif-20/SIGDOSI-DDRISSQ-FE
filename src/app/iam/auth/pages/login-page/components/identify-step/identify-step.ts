import { Component, inject, signal } from '@angular/core';
import { form, required, FormRoot, FormField, email } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { firstValueFrom } from 'rxjs';
import { IdentifyData } from '../../../../types/auth-types';
import { LoginStore } from '../../store/login-store';
import { Autofocus } from '../../../../../../shared/directives/autofocus';

@Component({
  imports: [
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmSpinnerImports,
    FormRoot,
    FormField,
    Autofocus,
  ],
  selector: 'sigdosi-auth-identify-step',
  styles: ``,
  templateUrl: './identify-step.html',
})
export class IdentifyStep {
  private readonly loginStore = inject(LoginStore);

  private readonly identifyModel = signal<IdentifyData>({
    email: '',
  });

  protected readonly identifyForm = form(
    this.identifyModel,
    (path) => {
      required(path.email, { message: 'El correo electrónico es obligatorio' });
      email(path.email, { message: 'El correo electrónico debe tener un formato válido' });
    },
    {
      submission: {
        action: async (form) => {
          try {
            await firstValueFrom(this.loginStore.identify(form().value()));
          } catch {
            return;
          }
        },
      },
    },
  );
}
