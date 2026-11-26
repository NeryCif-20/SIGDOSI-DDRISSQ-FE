import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHome, lucideRefreshCw } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { RouterLink } from '@angular/router';

@Component({
  imports: [HlmTypographyImports, HlmButtonImports, NgIcon, RouterLink],
  selector: 'sigdosi-error-page',
  styles: ``,
  templateUrl: './error-page.html',
  providers: [provideIcons({ lucideRefreshCw, lucideHome })],
})
export default class ErrorPage {
  public readonly url = input<string>();
}
