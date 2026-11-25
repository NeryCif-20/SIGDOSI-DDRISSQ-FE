import { Component, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';

@Component({
  imports: [HlmBadgeImports, HlmTypographyImports],
  selector: 'sigdosi-page-header',
  styles: ``,
  templateUrl: './page-header.html',
})
export class PageHeader {
  public readonly badge = input<string>();
  public readonly title = input.required<string>();
  public readonly description = input<string>();
}
