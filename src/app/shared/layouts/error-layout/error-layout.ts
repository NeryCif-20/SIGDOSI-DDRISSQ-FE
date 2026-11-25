import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSelector } from '../../components/theme-selector/theme-selector';

@Component({
  imports: [RouterOutlet, ThemeSelector],
  selector: 'sigdosi-error-layout',
  styleUrl: './error-layout.css',
  templateUrl: './error-layout.html',
})
export default class ErrorLayout {}
