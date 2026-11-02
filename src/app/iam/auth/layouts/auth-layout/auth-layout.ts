import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSelector } from '../../../../shared/components/theme-selector/theme-selector';

@Component({
  imports: [RouterOutlet, ThemeSelector],
  selector: 'sigdosi-auth-layout',
  styles: ``,
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
