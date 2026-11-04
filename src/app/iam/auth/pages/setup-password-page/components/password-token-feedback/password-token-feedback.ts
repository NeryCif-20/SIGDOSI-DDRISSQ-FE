import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap, timer } from 'rxjs';
import { AuthService } from '../../../../services/auth-service';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldEllipsis, lucideShieldX } from '@ng-icons/lucide';

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
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly authService = inject(AuthService);

  private readonly token = toSignal(
    this.activatedRoute.queryParamMap.pipe(map((params) => params.get('token')!)),
    {
      requireSync: true,
    },
  );

  protected readonly statusFeedback = computed<PasswordTokenStatusFeedback>(() => {
    if (this.authService.passwordTokenStatus() === 'CHECKING') {
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

  ngOnInit(): void {
    timer(1000)
      .pipe(switchMap(() => this.authService.validatePasswordToken({ token: this.token() })))
      .subscribe({
        error: () => undefined,
      });
  }
}
