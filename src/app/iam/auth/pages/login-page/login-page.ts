import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { CheckMailStep } from './components/check-mail-step/check-mail-step';
import { IdentifyStep } from './components/identify-step/identify-step';
import { PasswordStep } from './components/password-step/password-step';
import { LoginStore } from './store/login-store';

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
  providers: [LoginStore],
})
export class LoginPage {
  protected readonly loginStore = inject(LoginStore);
}
