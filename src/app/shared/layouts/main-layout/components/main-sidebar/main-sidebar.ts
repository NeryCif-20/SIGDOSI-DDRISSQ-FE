import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';

@Component({
  imports: [HlmSidebarImports, HlmTypographyImports],
  selector: 'sigdosi-main-sidebar',
  styles: ``,
  templateUrl: './main-sidebar.html',
})
export class MainSidebar {}
