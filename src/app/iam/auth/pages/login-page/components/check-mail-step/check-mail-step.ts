import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { LoginStore } from '../../store/login-store';

@Component({
  imports: [HlmEmptyImports, HlmSpinnerImports, NgIcon],
  selector: 'sigdosi-auth-check-mail-step',
  styles: ``,
  templateUrl: './check-mail-step.html',
  providers: [provideIcons({ lucideMail })],
})
export class CheckMailStep {
  private readonly loginStore = inject(LoginStore);

  protected readonly title = computed(() => {
    switch (this.loginStore.mailPurpose()) {
      case 'SET_PASSWORD':
        return 'Establece una contraseña';
      case 'RESET_PASSWORD':
        return 'Solicitud Enviada';
      default:
        return undefined;
    }
  });
}
