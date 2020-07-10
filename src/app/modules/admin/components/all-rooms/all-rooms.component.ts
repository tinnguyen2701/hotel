import {Component, OnInit} from '@angular/core';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {Store} from '@ngxs/store';
//
import {RoomService} from '../../services';
import {BaseLookup, BookedModel, FloorModel, RoomModel} from '../../models/room.model';
import {RoomStatus, ActionType, ActionNavigationType} from '../../shared/enums';
import {ROOM_STATUS_TYPE, TRANSFER_ROOM_TYPE} from '../../shared/constant';
import {AppState, SetActionType, SetBookCheckin, SetBookCheckout, SetEditBooking, SetFloor} from '../../store';
import {AppNotify} from '@app/utilities';

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
    isShowPopupTransferRoom: boolean = false;
    fromRoom: BaseLookup;
    toRoom: BaseLookup;
    roomSource: BaseLookup[] = [];
    transferOption: number;
    transferRoomType = TRANSFER_ROOM_TYPE;
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
        {
            value: ActionNavigationType.TransferRoom,
            name: 'Transfer room',
            icon: 'far fa-paper-plane',
        },
    ];

    constructor(private roomService: RoomService, private store: Store) {
    }

    ngOnInit() {
        this.floors.map(_ => _.rooms.map(x => this.roomSource.push({id: x.id, name: x.name})));
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
                this.menus = [
                    this.totalMenus[4],
                ];
                break;
            case RoomStatus.Checkin:
                this.menus = [
                    this.totalMenus[2],
                    this.totalMenus[3],
                    this.totalMenus[4],
                    this.totalMenus[5]
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
                    case ActionNavigationType.TransferRoom:
                        this.isShowPopupTransferRoom = true;
                        this.fromRoom = {id: this.selectedBooked.rooms[0].id, name: this.selectedBooked.rooms[0].name};
                        break;
                    default:
                        break;
                }
                this.visible = false;
            },
            (err) => {
                AppNotify.error('Get book went wrong!');
            }
        );
    }

    showTransferRoomPopup() {
        this.initTransferRoom();
        this.isShowPopupTransferRoom = true;
    }

    onHandleTransfer() {
        if (!this.fromRoom || !this.toRoom || !this.transferOption) {
            return;
        }

        this.roomService.transferRoom(this.fromRoom, this.toRoom).subscribe(rs => {
            this.isShowPopupTransferRoom = false;
            AppNotify.success('Transfer room success message');
            this.refresh();
        }, err => {
            this.isShowPopupTransferRoom = false;
            AppNotify.error('Can not transfer room!');
        });
        this.initTransferRoom(true);
    }

    refresh() {
        setTimeout(() => {
            this.loadFloors();
        });
    }

    loadFloors() {
        this.roomService.getFloors().subscribe(
            (result) => {
                console.log(result);
                this.store.dispatch(new SetFloor(result));
            },
            (err) => {
                AppNotify.error(err);
            }
        );
    }

    private initTransferRoom(isInitFromRoom = false) {
        if (isInitFromRoom) {
            this.fromRoom = {id: null, name: ''};
        }
        this.toRoom = {id: null, name: ''};
        this.transferOption = null;
    }
}
