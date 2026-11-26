import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideCircleUser, lucideLogOut } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { toast } from '@spartan-ng/brain/sonner';
import { AuthService } from '../../../../../iam/auth/services/auth-service';
import { UserAvatar } from '../../../../../iam/users/components/user-avatar/user-avatar';
import { injectMutation } from '@tanstack/angular-query';
import { firstValueFrom } from 'rxjs';
import { FullNamePipe } from '../../../../../iam/users/pipes/full-name-pipe';

@Component({
  imports: [
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmAvatarImports,
    HlmBadgeImports,
    NgIcon,
    UserAvatar,
    FullNamePipe,
  ],
  selector: 'sigdosi-main-user-menu',
  styles: ``,
  templateUrl: './main-user-menu.html',
  providers: [provideIcons({ lucideChevronDown, lucideCircleUser, lucideLogOut })],
})
export class MainUserMenu {
  private readonly authService = inject(AuthService);

  protected readonly user = computed(() => this.authService.user());

  protected readonly logoutMutation = injectMutation(() => ({
    mutationFn: () => firstValueFrom(this.authService.logout()),
    onSettled: () =>
      toast.success(this.authService.user()!.firstName, {
        description: 'Hasta pronto!!!',
      }),
  }));
}
