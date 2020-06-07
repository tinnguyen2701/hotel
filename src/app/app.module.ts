import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Injector, APP_INITIALIZER} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';
import {NgxPermissionsModule} from 'ngx-permissions';

import {ThemeModule} from '@app/theme';
import {SharedModule} from '@app/shared/shared.module';
import {AUTH_SCHEME, ACCESS_TOKEN_KEY} from '@app/shared/constants';
import {AppLoadService} from '@app/modules/core/services';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

export function initializeApp(injector: Injector) {
  return (): Promise<any> => {
    const appInitService = injector.get(AppLoadService);
    return appInitService.initApp();
  };
}

export function accessTokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ? decodeURIComponent(
    atob(localStorage.getItem(ACCESS_TOKEN_KEY))
  ) : null;
}


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    //
    NgxPermissionsModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: accessTokenGetter,
        authScheme: AUTH_SCHEME,
        blacklistedRoutes: [
          new RegExp('\/assets\/.*')
        ]
      }
    }),
    //
    SharedModule.forRoot(),
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Injector],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
