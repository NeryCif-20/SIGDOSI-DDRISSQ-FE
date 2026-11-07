import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthService } from './iam/auth/services/auth-service';
import { catchError, EMPTY, switchMap, timer } from 'rxjs';

@Component({
  imports: [RouterOutlet, HlmEmptyImports, HlmSpinnerImports, HlmToasterImports],
  selector: 'sigdosi-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  providers: [provideIcons({ lucideLoader })],
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);

  private readonly _isLoading = signal(false);
  protected readonly isLoading = this._isLoading.asReadonly();

  ngOnInit(): void {
    this._isLoading.set(true);
    timer(1500)
      .pipe(
        switchMap(() => this.authService.refresh()),
        catchError(() => EMPTY),
      )
      .subscribe({
        complete: () => this._isLoading.set(false),
      });
  }
}
