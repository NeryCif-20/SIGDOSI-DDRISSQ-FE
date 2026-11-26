import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSelector } from '../../../shared/components/theme-selector/theme-selector';

@Component({
  imports: [RouterOutlet, ThemeSelector],
  selector: 'sigdosi-error-layout',
  styleUrl: './error-layout.css',
  templateUrl: './error-layout.html',
})
export class ErrorLayout {}
