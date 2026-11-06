import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideCircleUser, lucideLogOut } from '@ng-icons/lucide';
import { InitialsPipe } from '@spartan-ng/brain/avatar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { toast } from '@spartan-ng/brain/sonner';
import { AuthService } from '../../../../../iam/auth/services/auth-service';

@Component({
  imports: [
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmAvatarImports,
    InitialsPipe,
    HlmBadgeImports,
    NgIcon,
  ],
  selector: 'sigdosi-main-user-menu',
  styles: ``,
  templateUrl: './main-user-menu.html',
  providers: [provideIcons({ lucideChevronDown, lucideCircleUser, lucideLogOut })],
})
export class MainUserMenu {
  private readonly authService = inject(AuthService);

  protected handleLogout() {
    this.authService.logout().subscribe({
      complete: () =>
        toast.success(this.authService.user()!.firstName, {
          description: 'Hasta pronto!!!',
        }),
    });
  }
}
