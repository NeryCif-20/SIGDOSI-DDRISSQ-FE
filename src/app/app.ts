import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  imports: [RouterOutlet, HlmEmptyImports, HlmSpinnerImports, HlmToasterImports],
  selector: 'sigdosi-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  providers: [provideIcons({ lucideLoader })],
})
export class App {
  private readonly _isLoading = signal(false);
  protected readonly isLoading = this._isLoading.asReadonly();
}
