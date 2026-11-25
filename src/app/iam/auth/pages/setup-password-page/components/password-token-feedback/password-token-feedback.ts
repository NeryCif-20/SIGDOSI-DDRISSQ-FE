import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom, switchMap, timer } from 'rxjs';
import { AuthService } from '../../../../services/auth-service';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldEllipsis, lucideShieldX } from '@ng-icons/lucide';
import { SetupPasswordStore } from '../../store/setup-password-store';
import { injectMutation } from '@tanstack/angular-query';

interface PasswordTokenStatusFeedback {
  icon: string;
  title: string;
  description: string;
}

@Component({
  imports: [HlmEmptyImports, HlmButtonImports, NgIcon, RouterLink],
  selector: 'sigdosi-auth-password-token-feedback',
  styles: ``,
  templateUrl: './password-token-feedback.html',
  providers: [provideIcons({ lucideShieldEllipsis, lucideShieldX })],
})
export class PasswordTokenFeedback implements OnInit {
  protected readonly setupPasswordStore = inject(SetupPasswordStore);
  protected readonly authService = inject(AuthService);

  protected readonly statusFeedback = computed<PasswordTokenStatusFeedback>(() => {
    if (this.setupPasswordStore.tokenStatus() === 'CHECKING') {
      return {
        icon: 'lucideShieldEllipsis',
        title: 'Verificando Enlace',
        description: 'Por favor, espera un momento.',
      };
    }
    return {
      icon: 'lucideShieldX',
      title: 'Enlace Invalido',
      description: 'No es posible continuar con el proceso.',
    };
  });

  private readonly validatePasswordTokenMutation = injectMutation(() => ({
    mutationFn: () =>
      firstValueFrom(
        timer(1000).pipe(switchMap(() => this.setupPasswordStore.validatePasswordToken())),
      ),
    onError: () => undefined,
  }));

  ngOnInit(): void {
    this.validatePasswordTokenMutation.mutate();
  }
}
