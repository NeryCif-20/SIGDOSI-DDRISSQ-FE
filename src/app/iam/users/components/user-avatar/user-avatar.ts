import { Component, input } from '@angular/core';
import { InitialsPipe } from '@spartan-ng/brain/avatar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
  imports: [HlmAvatarImports, InitialsPipe],
  selector: 'sigdosi-user-avatar',
  styles: ``,
  templateUrl: './user-avatar.html',
})
export class UserAvatar {
  public readonly avatar = input<string | null>(null);
  public readonly fallback = input.required<string>();
  public readonly classes = input<string>();
}
