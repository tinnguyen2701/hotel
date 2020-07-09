import {Component, OnInit} from '@angular/core';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {Store} from '@ngxs/store';
//
import {RoomService} from '../../services';
import {BookedModel, FloorModel, RoomModel} from '../../models/room.model';
import {RoomStatus, ActionType, ActionNavigationType} from '../../shared/enums';
import {ROOM_STATUS_TYPE} from '../../shared/constant';
import {AppState, SetActionType, SetBookCheckin, SetBookCheckout, SetEditBooking} from '../../store';

@Component({
    selector: 'app-admin-all-rooms',
    templateUrl: 'all-rooms.component.html',
    styleUrls: ['./all-rooms.component.scss'],
})
export class AllRoomsComponent implements OnInit {
    @SelectSnapshot(AppState.listFloor) floors: FloorModel[];

    roomStatus = RoomStatus;
    roomStatusType = ROOM_STATUS_TYPE;
    selectedStatus = RoomStatus.All;
    checkinDate: Date = null;
    checkoutDate: Date = null;
    selectedRoom: RoomModel = {} as RoomModel;
    selectedBooked: BookedModel = new BookedModel();
    visible: boolean = false;
    menus = [];

    totalMenus = [
        {
            value: ActionNavigationType.BookingNow,
            name: 'Booking now',
            icon: 'fa fa-plus',
        },
        {
            value: ActionNavigationType.AddToBookingList,
            name: 'Add to list booking',
            icon: 'fa fa-book',
        },
        {
            value: ActionNavigationType.CheckoutNow,
            name: 'Checkout now',
            icon: 'fa fa-check',
        },
        {
            value: ActionNavigationType.AddToCheckoutList,
            name: 'Add to list checkout',
            icon: 'fa fa-book',
        },
        {
            value: ActionNavigationType.Edit,
            name: 'Edit infomation',
            icon: 'fas fa-pencil-alt',
        },
    ];

    constructor(private roomService: RoomService, private store: Store) {
    }

    ngOnInit() {
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
        this.roomService.getBookRoom(this.selectedRoom.id, item.value).subscribe(
            (booked) => {
                this.selectedBooked = booked;

                switch (item.value) {
                    case ActionNavigationType.AddToBookingList:
                        this.store.dispatch(new SetBookCheckin(this.selectedBooked));
                        break;
                    case ActionNavigationType.BookingNow:
                        this.store.dispatch(new SetActionType(ActionType.Checkin));
                        this.store.dispatch(new SetEditBooking(this.selectedBooked));
                        break;
                    case ActionNavigationType.Edit:
                        this.store.dispatch(new SetActionType(ActionType.Edit));
                        this.store.dispatch(new SetEditBooking(this.selectedBooked));
                        break;
                    case ActionNavigationType.AddToCheckoutList:
                        this.store.dispatch(new SetBookCheckout(this.selectedBooked));
                        break;
                    case ActionNavigationType.CheckoutNow:
                        this.store.dispatch(new SetActionType(ActionType.Checkout));
                        this.store.dispatch(new SetEditBooking(this.selectedBooked));
                        break;
                    default:
                        break;
                }
                this.visible = false;

            },
            (err) => {
            }
        );
    }
}
