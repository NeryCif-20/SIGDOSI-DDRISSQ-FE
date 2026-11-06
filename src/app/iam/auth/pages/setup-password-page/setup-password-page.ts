import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { PasswordTokenFeedback } from './components/password-token-feedback/password-token-feedback';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { PasswordForm } from './components/password-form/password-form';
import { SetupPasswordStore } from './store/setup-password-store';

@Component({
  imports: [HlmTypographyImports, PasswordTokenFeedback, PasswordForm],
  selector: 'sigdosi-setup-password-page',
  styles: ``,
  templateUrl: './setup-password-page.html',
  providers: [SetupPasswordStore],
})
export default class SetupPasswordPage {
  protected readonly setupPasswordStore = inject(SetupPasswordStore);
  protected readonly authService = inject(AuthService);
}
