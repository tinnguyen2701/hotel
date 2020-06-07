import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {BookingModel} from '@app/modules/admin/models';
import {BookingService} from '@app/modules/admin/services';
import {AppNotify} from '@app/utilities';
import {BookingActivity} from '@app/modules/admin/shared/enums';

@Component({
    selector: 'app-booking-detail',
    templateUrl: './booking-detail.component.html',
    styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {
    private _visible: boolean = false;

    //
    @Input() selectedBooking: BookingModel = new BookingModel();

    @Input()
    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
        this.visibleChange.emit(value);
    }

    //
    @Output() visibleChange = new EventEmitter();
    @Output() onSuccess = new EventEmitter<BookingModel>();
    //
    _activity = BookingActivity;
    editingBooking: BookingModel = new BookingModel();
    bookingActivities = {
        [BookingActivity.Transportation]: false,
        [BookingActivity.IslandHopping]: false,
        [BookingActivity.Snorkeling]: false,
        [BookingActivity.ScubaDiving]: false,
        [BookingActivity.Overnight]: false
    };

    constructor(private bookingsService: BookingService) {
    }

    ngOnInit() {
        if (this.selectedBooking.id) {
            this.bookingsService.getBookingById(this.selectedBooking.id).subscribe((result) => {
                this.editingBooking = result;
            });
            if (this.editingBooking.activities && this.editingBooking.activities.length) {
                for (const key of Object.keys(this.bookingActivities)) {
                    if (this.editingBooking.activities.indexOf(key) !== -1) {
                        this.bookingActivities[key] = true;
                    } else {
                        this.bookingActivities[key] = false;
                    }
                }
            }
        }
    }

    submitForm(param: any) {
        if (!param.validationGroup.validate().isValid) {
            return false;
        }
        //
        this.editingBooking.activities = [];
        if (!this.bookingActivities[BookingActivity.Overnight]) {
            this.editingBooking.overnightD = null;
            this.editingBooking.overnightN = null;
        }
        for (const key of Object.keys(this.bookingActivities)) {
            if (this.bookingActivities[key]) {
                this.editingBooking.activities.push(key);
            }
        }
        //
        console.log(this.editingBooking);
        this.bookingsService.saveBooking(this.editingBooking).subscribe((account) => {
            let message = 'Created success';
            if (this.editingBooking.id) {
                message = 'Updated success';
            }
            AppNotify.success(message);
            this.onSuccess.emit(this.editingBooking);
        }, (error) => {
            AppNotify.error();
        });
    }
}
