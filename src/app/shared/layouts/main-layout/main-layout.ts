import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { RouterOutlet } from '@angular/router';
import { MainHeader } from './components/main-header/main-header';
import { MainSidebar } from './components/main-sidebar/main-sidebar';

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
