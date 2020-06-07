import {Component, OnInit, ViewChild} from '@angular/core';
import DataSource from 'devextreme/data/data_source';

import {BookingModel, FilterBookingModel} from '@app/modules/admin/models';
import {BookingService} from '@app/modules/admin/services';
import {STATUS_METHOD} from '@app/modules/admin/shared/constant';
import {PopoverConfirmBoxComponent} from '@app/shared/components';
import {AppNotify} from '@app/utilities';
import {LoadParamModel} from '@app/modules/core/models';
import {BookingActivity} from '@app/modules/admin/shared/enums';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.component.html',
    styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
    @ViewChild('deleteDetailConfirmPopover') deleteDetailConfirmPopover: PopoverConfirmBoxComponent;
    //
    dataSource: DataSource;
    filterBooking: FilterBookingModel = new FilterBookingModel();
    dataBooking: BookingModel = new BookingModel();
    //
    statusBooking = STATUS_METHOD;
    //
    selectedId: number;
    isOpenBookingDetailPopup: boolean = false;
    isProcessing: boolean = false;
    overnight: string = 'overnight';
    bookingActivities = {
        [BookingActivity.Transportation]: 'Transportation',
        [BookingActivity.IslandHopping]: 'Island hopping',
        [BookingActivity.Snorkeling]: 'Snorkeling',
        [BookingActivity.ScubaDiving]: 'Scuba diving',
        [BookingActivity.Overnight]: 'Overnight'
    };

    constructor(private bookingsService: BookingService) {
    }

    ngOnInit() {
        this.loadBookings();
    }

    loadBookings() {
        this.dataSource = new DataSource({
            load: (loadOptions) => {
                const loadParams = new LoadParamModel(loadOptions, this.filterBooking);
                return this.bookingsService.getBookings(loadParams).toPromise();
            }
        });
    }

    onSearchBooking(param: FilterBookingModel) {
        this.filterBooking = param;
        this.loadBookings();
    }

    onBookingDetail(param: BookingModel) {
        this.dataBooking = param;
        this.isOpenBookingDetailPopup = true;
    }

    createBooking() {
        this.dataBooking = new BookingModel();
        this.isOpenBookingDetailPopup = true;
    }

    onDeleteBooking(id: number, e) {
        this.selectedId = id;
        if (this.deleteDetailConfirmPopover) {
            this.deleteDetailConfirmPopover.show(e.currentTarget);
        }
    }

    onUpdateBookingSuccess($event: any) {
        this.isOpenBookingDetailPopup = false;
        this.loadBookings();
    }

    deleteBooking() {
        this.isProcessing = true;
        this.bookingsService.deleteBooking(this.selectedId).subscribe(() => {
            AppNotify.success('Deleted success');
            this.loadBookings();
            this.isProcessing = false;
        }, (error) => {
            AppNotify.error();
            this.isProcessing = false;
        });
    }
}
