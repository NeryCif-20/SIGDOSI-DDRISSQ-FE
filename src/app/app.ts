import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthService } from './iam/auth/services/auth-service';
import { injectMutation } from '@tanstack/angular-query';
import { firstValueFrom, switchMap, timer } from 'rxjs';

@Component({
  imports: [RouterOutlet, HlmEmptyImports, HlmSpinnerImports, HlmToasterImports],
  selector: 'sigdosi-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  providers: [provideIcons({ lucideLoader })],
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly refreshMutation = injectMutation(() => ({
    mutationFn: () => firstValueFrom(timer(500).pipe(switchMap(() => this.authService.refresh()))),
    onSettled: () => this.router.initialNavigation(),
  }));

  protected readonly isChecking = computed(() => this.authService.status() === 'CHECKING');

  ngOnInit(): void {
    this.refreshMutation.mutate();
  }
}
