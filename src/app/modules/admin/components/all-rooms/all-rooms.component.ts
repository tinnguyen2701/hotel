import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
//
import { RoomService } from '../../services';
import { FloorModel, RoomModel } from '../../models/room.model';
import { RoomStatus } from '../../shared/enums';
import { ROOM_STATUS_TYPE } from '../../shared/constant';
import { SetListRoom, AppState } from '../../store';

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
    showBookingNow: boolean = false;
    visible: boolean = false;
    menus = [];

    totalMenus = [
        {
            value: ActionType.BookingNow,
            name: 'Booking now',
            icon: 'fa fa-plus',
        },
        {
            value: ActionType.AddToBookingList,
            name: 'Add to list booking',
            icon: 'fa fa-book',
        },
        {
            value: ActionType.CheckoutNow,
            name: 'Checkout now',
            icon: 'fa fa-check',
        },
        {
            value: ActionType.AddToCheckoutList,
            name: 'Add to list checkout',
            icon: 'fa fa-book',
        },
        {
            value: ActionType.Edit,
            name: 'Edit infomation',
            icon: 'fas fa-pencil-alt',
        },
    ];

    constructor(private roomService: RoomService, private store: Store) {}

    ngOnInit() {
        this.loadFloor();
    }

    loadFloor() {
        this.roomService.getFloors().subscribe(
            (result) => {
                this.floors = result;
                console.log(this.floors);
            },
            (err) => {}
        );
    }

    onClickRoom(room: RoomModel) {
        this.selectedRoom = room;
        this.visible = true;

        switch (room.status) {
            case RoomStatus.Available:
                this.menus = [
                    this.totalMenus[0],
                    this.totalMenus[1],
                    this.totalMenus[4],
                ];
                break;
            case RoomStatus.Booking:
                this.menus = [this.totalMenus[4]];
                break;
            case RoomStatus.Checkin:
                this.menus = [
                    this.totalMenus[2],
                    this.totalMenus[3],
                    this.totalMenus[4],
                ];
                break;
            default:
                break;
        }
    }

    onClickItem(item) {
        this.roomService.getRoom(this.selectedRoom.id).subscribe(
            (result) => {
                this.selectedRoom = result;

                if (item.value === ActionType.AddToBookingList) {
                    this.store.dispatch(new SetListRoom(this.selectedRoom));
                    this.visible = false;
                } else if (item.value === ActionType.BookingNow) {
                    this.selectedRoom = result;
                    this.showBookingNow = true;
                    this.visible = false;
                }
            },
            (err) => {}
        );
    }
}
