import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHome } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';

@Component({
  imports: [HlmTypographyImports, HlmButtonImports, NgIcon, RouterLink],
  selector: 'sigdosi-error404-page',
  styles: ``,
  templateUrl: './error404-page.html',
  providers: [provideIcons({ lucideHome })],
})
export default class Error404Page {}
