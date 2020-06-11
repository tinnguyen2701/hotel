import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThemeModule, RouterOutletComponent } from '@app/theme';
import { SharedModule } from '@app/shared/shared.module';
import { BookingService } from '@app/modules/admin/services';
import { AdminComponent } from './components/admin/admin.component';
import { UsersComponent } from './components/users/users.component';
import { SearchFormComponent } from '@app/modules/admin/components/shared/search-form/search-form.component';
import { AllRoomsComponent } from './components/all-rooms/all-rooms.component';
import { BookedClientsComponent } from './components/booked/booked.component';
import { NgxsModule } from '@ngxs/store';
import { SetListRoom } from '../core/store';

const PROVIDERS = [
    BookingService,
];

export const STATES = [
    SetListRoom
];

@NgModule({
    imports: [
        NgxsModule.forFeature([...STATES]),
        ThemeModule,
        SharedModule,
        //
        RouterModule.forChild([
            {
                path: '',
                component: AdminComponent,
                children: [
                    { path: '', redirectTo: 'all', pathMatch: 'full' },
                    {
                        path: 'all',
                        component: AllRoomsComponent
                    },
                    {
                        path: 'booked',
                        component: BookedClientsComponent
                    },
                ]
            }
        ]),
    ],
    declarations: [
        AllRoomsComponent,
        AdminComponent,
        UsersComponent,
        BookedClientsComponent,
        SearchFormComponent
    ],
    providers: [
        ...PROVIDERS
    ]
})
export class AdminModule {
}
