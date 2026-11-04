import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthService } from '../../../../services/auth-service';

@Component({
  imports: [HlmEmptyImports, HlmSpinnerImports, NgIcon],
  selector: 'sigdosi-auth-check-mail-step',
  styles: ``,
  templateUrl: './check-mail-step.html',
  providers: [provideIcons({ lucideMail })],
})
export class CheckMailStep {
  private readonly authService = inject(AuthService);

  protected readonly title = computed(() =>
    this.authService.isForgotPassword() ? 'Solicitud Enviada' : 'Establece una Contraseña',
  );
}
