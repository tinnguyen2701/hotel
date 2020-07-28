import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
//
import {BookedModel, RoomModel} from '@app/modules/admin/models';
import {AppNotify} from '@app/utilities';
import {BookedStatus, RoomStatus, RoomType} from '@app/modules/admin/shared/enums';
import {BookingService} from '@app/modules/admin/services';

@Component({
    selector: 'app-admin-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
    private _visible: boolean = false;
    //
    @Input() listRoomSelected: RoomModel[] = [];
    @Input() allRoomsAvailable: RoomModel[] = [];
    @Input() allRoomBooking: RoomModel[] = [];
    @Input() selectedBookedStatus: BookedStatus;

    @Input()
    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
        this.visibleChange.emit(value);
    }

    //
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onSaveBooking = new EventEmitter<void>();
    @Output() onDeleteRoomId = new EventEmitter<number>();
    //

    isGroupBooking: boolean = false;
    selectedBooking: BookedModel = new BookedModel();
    isShowBookedCodeReceived: boolean = false;
    bookedCodeReceived: string;
    bookedStatus = BookedStatus;
    roomStatus = RoomStatus;
    roomTypes: { value: number, name: string }[] = [
        {value: RoomType.Single, name: 'Single Room'},
        {value: RoomType.Double, name: 'Double Room'}
    ];

    rooms = 'Rooms';
    customers = 'Customers';
    services = 'Services';
    menuTabs: { value: string, text: string, enableHistory: boolean, visited: boolean }[] = [];
    currentTab: { value: string, text: string, enableHistory: boolean, visited: boolean };


    constructor(private bookingsService: BookingService) {
    }

    ngOnInit() {
        this.isGroupBooking = this.listRoomSelected.length > 1;
        if (!this.isGroupBooking) {
            // personal booking
            // handler checkin from reservation
            if (this.selectedBookedStatus === this.bookedStatus.Checkin
                && this.listRoomSelected && this.listRoomSelected[0].status === this.roomStatus.Booking) {
                this.bookingsService.getBooking(this.listRoomSelected).subscribe(rs => {
                    this.selectedBooking = rs;
                    console.log(this.selectedBooking);
                });
            } else {
                if (this.listRoomSelected.length === 1) {
                    // information booking
                    this.selectedBooking.checkinDate = this.listRoomSelected[0].checkinDate;
                    this.selectedBooking.checkoutDate = this.listRoomSelected[0].checkoutDate;
                    // information room
                    this.selectedBooking.roomId = this.listRoomSelected[0].id;
                    this.selectedBooking.roomPrice = this.listRoomSelected[0].price;
                    this.selectedBooking.roomType = this.listRoomSelected[0].type;
                }
            }
            this.menuTabs = [
                {
                    value: this.customers,
                    text: 'Customers',
                    enableHistory: true,
                    visited: true,
                },
                {
                    value: this.services,
                    text: 'Services',
                    enableHistory: true,
                    visited: true,
                },
            ];
            this.currentTab = this.menuTabs[0];
        } else {
            // group booking
            // handler checkin from reservation
            if (this.selectedBookedStatus === this.bookedStatus.Checkin
                && this.listRoomSelected && this.listRoomSelected[0].status === this.roomStatus.Booking) {
                this.bookingsService.getBooking(this.listRoomSelected).subscribe(rs => {
                    this.selectedBooking = rs;
                    console.log(this.selectedBooking);
                });
            } else {
                this.selectedBooking.rooms = this.listRoomSelected;
            }
            this.menuTabs = [
                {
                    value: this.rooms,
                    text: 'Rooms',
                    enableHistory: true,
                    visited: true,
                },
                {
                    value: this.customers,
                    text: 'Customers',
                    enableHistory: true,
                    visited: true,
                },
                {
                    value: this.services,
                    text: 'Services',
                    enableHistory: true,
                    visited: true,
                },
            ];
            this.currentTab = this.menuTabs[0];
        }
    }

    onSwitchBookingChanged() {
        if (this.isGroupBooking) {
            this.menuTabs = [
                {
                    value: this.rooms,
                    text: 'Rooms',
                    enableHistory: true,
                    visited: true,
                },
                {
                    value: this.customers,
                    text: 'Customers',
                    enableHistory: true,
                    visited: true,
                },
                {
                    value: this.services,
                    text: 'Services',
                    enableHistory: true,
                    visited: true,
                },
            ];
        } else {
            this.menuTabs = [
                {
                    value: this.customers,
                    text: 'Customers',
                    enableHistory: true,
                    visited: true,
                },
                {
                    value: this.services,
                    text: 'Services',
                    enableHistory: true,
                    visited: true,
                },
            ];
        }
        this.currentTab = this.menuTabs[0];
    }

    onChangedRoom() {
        const selectedRoom = this.allRoomsAvailable.find(_ => _.id === this.selectedBooking.roomId);
        if (selectedRoom) {
            this.selectedBooking.roomPrice = selectedRoom.price;
            this.selectedBooking.roomType = selectedRoom.type;
        }
    }

    onChangedTab(tab) {
        this.currentTab = tab;
    }


    onHandleCancel() {
        this.visible = false;
    }

    onHandleBooking() {
        if (this.isEmptyInformation()) {
            return;
        }

        this.bookingsService.booking(this.selectedBooking, this.selectedBookedStatus)
            .subscribe(rs => {
                    this.bookedCodeReceived = rs;
                    this.isShowBookedCodeReceived = true;
                    this.onSaveBooking.emit();
                }, (error) => {
                    AppNotify.error('Update error!');
                }
            );
    }

    onReceivedCode() {
        this.isShowBookedCodeReceived = false;
        this.visible = false;
    }


    onDeleteRoom(roomId: number) {
        this.onDeleteRoomId.emit(roomId);
        this.selectedBooking.rooms = this.selectedBooking.rooms.filter(_ => _.id !== roomId);
    }

    private isEmptyInformation() {
        if (!this.selectedBooking.checkinDate
            || !this.selectedBooking.checkoutDate
            || !this.selectedBooking.customers.length) {
            AppNotify.error('The information is required');
            return true;
        }
        if (!this.isGroupBooking) {
            if (!this.selectedBooking.roomId) {
                AppNotify.error('The information is required');
                return true;
            }
        } else {
            if (!this.selectedBooking.rooms.length
                || !this.selectedBooking.name) {
                AppNotify.error('The information is required');
                return true;
            }
        }
        return false;
    }
}
