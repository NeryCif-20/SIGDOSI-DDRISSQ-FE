import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [HlmEmptyImports, HlmSpinnerImports, NgIcon],
  selector: 'sigdosi-auth-password-action-feedback',
  styles: ``,
  templateUrl: './password-action-feedback.html',
  providers: [provideIcons({ lucideMail })],
})
export class PasswordActionFeedback {
  private readonly authService = inject(AuthService);

  protected readonly title = computed<string>(() =>
    this.authService.isForgotPassword() ? 'Solicitud enviada' : 'Establece una contraseña',
  );
}
