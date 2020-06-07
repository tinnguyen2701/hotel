import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';

import {ErrorComponent} from '@app/theme';
import {AuthGuard, GuestGuard} from '@app/modules/auth/services';

const routes: Routes = [
    {path: '', redirectTo: 'admin', pathMatch: 'full'},
    {
        path: 'admin',
        loadChildren: () => import('@app/modules/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard]
    },
    {
        path: '',
        loadChildren: () => import('@app/modules/auth/auth.module').then(m => m.AuthModule),
    },
    {path: '**', component: ErrorComponent}
];

const config: ExtraOptions = {
    useHash: false
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
