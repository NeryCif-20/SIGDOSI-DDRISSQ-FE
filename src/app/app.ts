import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthService } from './iam/auth/services/auth-service';
import { catchError, EMPTY, firstValueFrom, switchMap, timer } from 'rxjs';
import { injectMutation } from '@tanstack/angular-query';

@Component({
  imports: [RouterOutlet, HlmEmptyImports, HlmSpinnerImports, HlmToasterImports],
  selector: 'sigdosi-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  providers: [provideIcons({ lucideLoader })],
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);

  protected readonly refreshMutation = injectMutation(() => ({
    mutationFn: () =>
      firstValueFrom(
        timer(500).pipe(
          switchMap(() => this.authService.refresh()),
          catchError(() => EMPTY),
        ),
      ),
  }));

  ngOnInit(): void {
    this.refreshMutation.mutate();
  }
}
