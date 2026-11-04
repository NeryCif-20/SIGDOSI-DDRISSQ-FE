import { Component, inject, signal } from '@angular/core';
import { form, required, FormRoot, FormField, email } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../services/auth-service';
import { ErrorHandler } from '../../../../../../shared/services/error-handler';
import { IdentifyData } from '../../../../types/auth-types';
import { HttpErrorResponse } from '@angular/common/http';

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
    (path) => {
      required(path.email, { message: 'El correo electrónico es obligatorio' });
      email(path.email, { message: 'El correo electrónico debe tener un formato válido' });
    },
    {
      submission: {
        action: async (form) => {
          try {
            await firstValueFrom(this.authService.indentify(form().value()));
          } catch (error: unknown) {
            if (error instanceof HttpErrorResponse) this.errorHandler.handle(error);
          }
        },
      },
    },
  );
}
