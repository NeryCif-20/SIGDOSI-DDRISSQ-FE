import { Component, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
  imports: [HlmBadgeImports],
  selector: 'sigdosi-id-badge',
  styles: ``,
  templateUrl: './id-badge.html',
})
export class IdBadge {
  public readonly id = input.required<string>();
}
