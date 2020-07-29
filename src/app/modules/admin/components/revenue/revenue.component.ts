import {Component, OnInit} from '@angular/core';
import {BookingService} from '@app/modules/admin/services';
import {ActionNavigationType, ActionType} from '@app/modules/admin/shared/enums';
import {SetActionType, SetBookAvailable, SetBookCheckin, SetBookCheckout, SetEditBooking} from '@app/modules/admin/store';
import {AppNotify} from '@app/utilities';
import {RevenueModel} from '@app/modules/admin/models';

@Component({
    selector: 'app-admin-revenue',
    templateUrl: './revenue.component.html',
    styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {
    revenue: RevenueModel;

    constructor(private bookingService: BookingService) {
    }

    ngOnInit() {
        this.getRevenueByMonth();
    }

    private getRevenueByMonth() {
        this.bookingService.getRevenue().subscribe(
            (rs) => {
                this.revenue = rs;
            },
            (err) => {
                AppNotify.error('Get book went wrong!');
            });
    }

}
