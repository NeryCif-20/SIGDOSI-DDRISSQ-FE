import { Component, inject } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { BreadcrumbService } from '../../services/breadcrumb-service';

@Component({
  imports: [HlmBreadcrumbImports],
  selector: 'sigdosi-main-breadcrumb',
  styles: ``,
  templateUrl: './main-breadcrumb.html',
})
export class MainBreadcrumb {
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected readonly items = this.breadcrumbService.items;
}
