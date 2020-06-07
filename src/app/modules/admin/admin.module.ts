import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ThemeModule, RouterOutletComponent} from '@app/theme';
import {SharedModule} from '@app/shared/shared.module';
import {BookingService, PartnerService} from '@app/modules/admin/services';
import {BookingsComponent} from './components/bookings/bookings.component';
import {AdminComponent} from './components/admin/admin.component';
import {UsersComponent} from './components/users/users.component';
import {ScheduleComponent} from './components/schedule/schedule.component';
import {RevenueComponent} from './components/revenue/revenue.component';
import {BookingDetailComponent} from '@app/modules/admin/components/bookings/booking-detail/booking-detail.component';
import {SearchFormComponent} from '@app/modules/admin/components/shared/search-form/search-form.component';
import {BoatService} from '@app/modules/admin/services/boat.services';
import { AllRoomsComponent } from './components/all-rooms/all-rooms.component';
import { AvailableRoomsComponent } from './components/available-rooms/available-rooms.component';
import { BookedClientsComponent } from './components/booked-clients/booked-clients.component';
import { GroupsComponent } from './components/groups/groups.component';

const PROVIDERS = [
    BookingService,
    PartnerService,
    BoatService
];

@NgModule({
    imports: [
        ThemeModule,
        SharedModule,
        //
        RouterModule.forChild([
            {
                path: '',
                component: AdminComponent,
                children: [
                    {path: '', redirectTo: 'all', pathMatch: 'full'},
                    {
                        path: 'all',
                        component: AllRoomsComponent
                    },
                    {
                        path: 'available-rooms',
                        component: AvailableRoomsComponent
                    },
                    {
                        path: 'booked-clients',
                        component: BookedClientsComponent
                    },
                    {
                        path: 'groups',
                        component: GroupsComponent
                    },
                    // {
                    //     // To fix the top menu issue
                    //     path: 'boats',
                    //     component: RouterOutletComponent,
                    //     children: [
                    //         {path: '', redirectTo: 'partners', pathMatch: 'full'},
                    //         {
                    //             path: 'partners',
                    //             component: PartnersComponent
                    //         },
                    //         {
                    //             path: 'list',
                    //             component: BoatsComponent
                    //         },
                    //         {
                    //             path: 'schedule',
                    //             component: ScheduleComponent
                    //         }
                    //     ]
                    // },
                    // {
                    //     path: 'revenue',
                    //     component: RevenueComponent
                    // }
                ]
            }
        ]),
    ],
    declarations: [
        AllRoomsComponent,
        BookingsComponent,
        AdminComponent,
        UsersComponent,
        BookedClientsComponent,
        ScheduleComponent,
        RevenueComponent,
        BookingDetailComponent,
        SearchFormComponent,
        AvailableRoomsComponent
    ],
    providers: [
        ...PROVIDERS
    ]
})
export class AdminModule {
}
