import { Component, inject, signal } from '@angular/core';
import { form, required, FormRoot, FormField } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { firstValueFrom } from 'rxjs';
import { IdentifyData } from '../../types/auth-types';
import { AuthService } from '../../services/auth-service';
import { ErrorHandler } from '../../../../shared/services/error-handler';

@Component({
  imports: [
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmSpinnerImports,
    FormRoot,
    FormField,
  ],
  selector: 'sigdosi-auth-identify-step',
  styles: ``,
  templateUrl: './identify-step.html',
})
export class IdentifyStep {
  private readonly authService = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandler);

  private readonly identifyModel = signal<IdentifyData>({
    email: '',
  });

  protected readonly identifyForm = form(
    this.identifyModel,
    (schemaPath) => {
      required(schemaPath.email, { message: 'El correo electrónico es obligatorio' });
    },
    {
      submission: {
        action: async (form) => {
          try {
            await firstValueFrom(this.authService.indentify(form().value()));
          } catch (error: unknown) {
            this.errorHandler.handle(error);
          }
        },
      },
    },
  );
}
