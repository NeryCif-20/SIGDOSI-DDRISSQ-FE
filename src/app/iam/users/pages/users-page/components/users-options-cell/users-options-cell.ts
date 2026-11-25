import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideEye, lucidePencil } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { RouterLink } from '@angular/router';

@Component({
  imports: [HlmDropdownMenuImports, HlmButtonImports, NgIcon, RouterLink],
  selector: 'sigdosi-users-options-cell',
  styles: ``,
  templateUrl: './users-options-cell.html',
  providers: [provideIcons({ lucideEllipsis, lucideEye, lucidePencil })],
})
export class UsersOptionsCell {
  public readonly id = input.required<string>();
}
