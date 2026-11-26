import { Component, computed, input } from '@angular/core';
import { InitialsPipe } from '@spartan-ng/brain/avatar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { twMerge } from 'tailwind-merge';

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

  protected readonly finalClasses = computed(() => twMerge('mx-auto', this.classes()));
}
