import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addWithCredentialsInterceptor } from './core/interceptors/add-with-credentials-interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error-interceptor';
import { addAccessTokenInterceptor } from './core/interceptors/add-access-token-interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        addWithCredentialsInterceptor,
        addAccessTokenInterceptor,
        refreshTokenInterceptor,
        httpErrorInterceptor,
      ]),
    ),
  ],
};
