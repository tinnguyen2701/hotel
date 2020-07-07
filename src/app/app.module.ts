import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Injector, APP_INITIALIZER} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';
import {NgxPermissionsModule} from 'ngx-permissions';

import {SharedModule} from '@app/shared/shared.module';
import {AUTH_SCHEME, ACCESS_TOKEN_KEY} from '@app/shared/constants';
import {AppLoadService} from '@app/modules/core/services';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppState} from './modules/admin/store';
import {NgxsModule} from '@ngxs/store';
import {NgxsSelectSnapshotModule} from '@ngxs-labs/select-snapshot';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {environment} from '@environment';
import { RoomService } from './modules/admin/services';

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

export const STATES = [
    AppState
];

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        //
        NgxsModule.forRoot([...STATES]),
        NgxsSelectSnapshotModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            name: 'Eldesk Store',
            disabled: environment.production
        }),
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
        },
        RoomService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
