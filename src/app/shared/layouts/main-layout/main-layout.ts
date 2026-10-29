import { Component } from '@angular/core';
import { MainSidebar } from '../../components/main-sidebar/main-sidebar';
import { MainHeader } from '../../components/main-header/main-header';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, HlmSidebarImports, MainSidebar, MainHeader],
  selector: 'sigdosi-main-layout',
  styles: ``,
  templateUrl: './main-layout.html',
  host: {
    class: 'block [--header-height:--spacing(16)]',
  },
})
export class MainLayout {}
