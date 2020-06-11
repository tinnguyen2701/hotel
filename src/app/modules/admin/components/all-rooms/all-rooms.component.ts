import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services';
import { FloorModel, RoomModel } from '../../models/room.model';
import { RoomStatus } from '../../shared/enums';
import { ROOM_STATUS_TYPE } from '../../shared/constant';
import { Store } from '@ngxs/store';
import { SetListRoom } from '../../store';

export enum ActionType {
    Edit,
    AddToBookingList,
    AddToCheckoutList,
    BookingNow,
    CheckoutNow,
}

@Component({
    selector: 'app-admin-all-rooms',
    templateUrl: 'all-rooms.component.html',
    styleUrls: ['./all-rooms.component.scss'],
})
export class AllRoomsComponent implements OnInit {
    floors: FloorModel[] = [];
    roomStatus = RoomStatus;
    roomStatusType = ROOM_STATUS_TYPE;
    selectedStatus = RoomStatus.All;
    checkinDate: Date = null;
    checkoutDate: Date = null;
    selectedRoom: RoomModel = {} as RoomModel;
    defaultVisible: boolean;
    menus = [
        {
            value: ActionType.Edit,
            name: 'Edit infomation',
            icon: 'fas fa-pencil-alt',
        },
        {
            value: ActionType.AddToBookingList,
            name: 'Add to list booking',
            icon: 'fa fa-book',
        },
        {
            value: ActionType.AddToCheckoutList,
            name: 'Add to list checkout',
            icon: 'fa fa-book',
        },
        {
            value: ActionType.BookingNow,
            name: 'Booking now',
            icon: 'fa fa-plus',
        },
        {
            value: ActionType.CheckoutNow,
            name: 'Checkout now',
            icon: 'fa fa-check',
        },
    ];

    constructor(private bookingsService: BookingService, private store: Store) {}

    ngOnInit() {
        this.loadFloor();
    }

    loadFloor() {
        this.bookingsService.getFloors().subscribe(
            (result) => {
                this.floors = result;
                console.log(this.floors);
            },
            (err) => {}
        );
    }

    onClickRoom(room: RoomModel) {
        this.selectedRoom = room;
    }

    toggleDefault() {
        this.defaultVisible = !this.defaultVisible;
    }

    onClickItem(item) {
        this.store.dispatch(new SetListRoom(this.selectedRoom));
    }
}
