import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { SetupPasswordForm } from './components/setup-password-form/setup-password-form';
import { PasswordTokenFeedback } from './components/password-token-feedback/password-token-feedback';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';

@Component({
  imports: [HlmTypographyImports, SetupPasswordForm, PasswordTokenFeedback],
  selector: 'sigdosi-setup-password-page',
  styles: ``,
  templateUrl: './setup-password-page.html',
})
export default class SetupPasswordPage {
  protected readonly authService = inject(AuthService);
}
