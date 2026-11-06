import { computed, inject, Service, signal } from '@angular/core';
import { AuthStep, IdentifyData } from '../../../types/auth-types';
import { AuthApiService } from '../../../services/auth-api-service';
import { map, tap } from 'rxjs';

type MailPurpose = 'SET_PASSWORD' | 'RESET_PASSWORD';

interface AuthLoginContext {
  step: AuthStep | 'IDENTIFY';
  mailPurpose?: MailPurpose;
}

@Service({ autoProvided: false })
export class LoginStore {
  private readonly authApiService = inject(AuthApiService);

  private readonly context = signal<AuthLoginContext>({ step: 'IDENTIFY' });

  public readonly step = computed(() => this.context().step);
  public readonly mailPurpose = computed(() => this.context().mailPurpose);

  private updateContext(context: AuthLoginContext) {
    this.context.set({
      ...context,
      mailPurpose: context.step !== 'CHECK_MAIL' ? undefined : context.mailPurpose,
    });
  }

  public identify(data: IdentifyData) {
    return this.authApiService.indentify(data).pipe(
      map(({ nextStep: step }) =>
        this.updateContext({
          step,
          mailPurpose: step === 'CHECK_MAIL' ? 'SET_PASSWORD' : undefined,
        }),
      ),
    );
  }

  public requestForgotPasswordMail() {
    return this.authApiService.requestForgotPasswordMail().pipe(
      tap(() =>
        this.updateContext({
          step: 'CHECK_MAIL',
          mailPurpose: 'RESET_PASSWORD',
        }),
      ),
    );
  }
}
