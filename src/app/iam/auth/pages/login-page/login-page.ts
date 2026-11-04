import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { AuthService } from '../../services/auth-service';
import { CheckMailStep } from './components/check-mail-step/check-mail-step';
import { IdentifyStep } from './components/identify-step/identify-step';
import { PasswordStep } from './components/password-step/password-step';

@Component({
  imports: [
    HlmTypographyImports,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmEmptyImports,
    IdentifyStep,
    PasswordStep,
    CheckMailStep,
  ],
  selector: 'sigdosi-login-page',
  styles: ``,
  templateUrl: './login-page.html',
})
export class LoginPage {
  protected readonly authService = inject(AuthService);
}
