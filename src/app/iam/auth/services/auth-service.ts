import { computed, inject, Service, signal } from '@angular/core';
import { User } from '../../users/user-types';
import { AuthApiService } from './auth-api-service';
import { AuthResponse, LoginData, SetupPasswordData } from '../types/auth-types';
import { catchError, finalize, map, Observable, switchMap, throwError } from 'rxjs';
import { UserApiService } from '../../users/services/user-api-service';

type AuthStatus = 'CHECKING' | 'AUTHENTICATED' | 'NOT_AUTHENTICATED';

interface AuthContext {
  status: AuthStatus;
  accessToken: string | null;
  user: User | null;
}

@Service()
export class AuthService {
  private readonly authApiService = inject(AuthApiService);
  private readonly userApiService = inject(UserApiService);

  private readonly context = signal<AuthContext>({
    status: 'CHECKING',
    accessToken: null,
    user: null,
  });

  public readonly status = computed(() => this.context().status);
  public readonly accessToken = computed(() => this.context().accessToken);
  public readonly user = computed(() => this.context().user);

  private authenticate(request$: Observable<AuthResponse>) {
    return request$.pipe(
      switchMap(({ accessToken }) => {
        this.context.update((context) => ({ ...context, accessToken }));
        return this.userApiService.getAuthenticatedUser();
      }),
      map((user) =>
        this.context.update((context) => ({ ...context, status: 'AUTHENTICATED', user: user })),
      ),
      catchError((error) => this.logout().pipe(switchMap(() => throwError(() => error)))),
    );
  }

  public login(data: LoginData) {
    return this.authenticate(this.authApiService.login(data));
  }

  public setupPassword(data: SetupPasswordData) {
    return this.authenticate(this.authApiService.setupPassword(data));
  }

  public refresh() {
    return this.authenticate(this.authApiService.refresh());
  }

  public logout() {
    return this.authApiService
      .logout()
      .pipe(
        finalize(() =>
          this.context.set({ status: 'NOT_AUTHENTICATED', accessToken: null, user: null }),
        ),
      );
  }
}
