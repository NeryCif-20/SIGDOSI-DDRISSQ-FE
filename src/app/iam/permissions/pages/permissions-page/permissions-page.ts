import { Component } from '@angular/core';
import { PermissionsHeader } from './components/permissions-header/permissions-header';
import { PermissionsFilters } from './components/permissions-filters/permissions-filters';

@Component({
  imports: [PermissionsHeader, PermissionsFilters],
  selector: 'sigdosi-permissions-page',
  styles: ``,
  templateUrl: './permissions-page.html',
})
export default class PermissionsPage {}
