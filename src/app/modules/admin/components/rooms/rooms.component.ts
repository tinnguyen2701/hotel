import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
//
import {BookingService} from '../../services';
import {FloorModel, QuerySearchingModel, RoomModel, TransferRoom} from '../../models/roomModel';
import {RoomStatus} from '../../shared/enums';
import {ROOM_TYPE, TRANSFER_ROOM_TYPE} from '../../shared/constant';
import {BaseLookup} from '@app/modules/admin/models';
import {AppNotify} from '@app/utilities';

@Component({
    selector: 'app-admin-rooms',
    templateUrl: 'rooms.component.html',
    styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
    floors: FloorModel[] = [];
    roomType = ROOM_TYPE;
    roomStatus = RoomStatus;
    listRoomsSelected: RoomModel[] = [];
    querySearching: QuerySearchingModel = new QuerySearchingModel();
    isShowBooking: boolean = false;
    isShowPopupTransferRoom: boolean = false;
    transferRoom = new TransferRoom();
    transferRoomType = TRANSFER_ROOM_TYPE;
    allRoomsAvailable: RoomModel[] = [];
    allRoomsNotAvailable: RoomModel[] = [];

    constructor(private bookingService: BookingService) {
    }

    ngOnInit() {
        this.loadFloor();
    }

    loadFloor() {
        this.bookingService.getFloors(this.querySearching).subscribe((floors) => {
            this.floors = floors;
        });
    }

    onClickedRoom(room: RoomModel, e: any) {
        const index = this.listRoomsSelected.findIndex(_ => _.id === room.id);
        const selectedListRoomsStatus = this.listRoomsSelected[0]?.status || null;

        if (!selectedListRoomsStatus || room.status === selectedListRoomsStatus) {
            if (index === -1) {
                this.listRoomsSelected.push(room);
                e.element.classList.add('selected');
            } else {
                this.listRoomsSelected.splice(index, 1);
                e.element.classList.remove('selected');
            }
        }
    }

    onChangedQuerySearching() {
        this.loadFloor();
    }

    onToggleBooking() {
        this.allRoomAvailable();
        this.isShowBooking = !this.isShowBooking;
    }

    onClickedTransferRoom() {
        this.allRoomAvailable();
        this.transferRoom.fromRoomId = this.listRoomsSelected[0].id;
        this.isShowPopupTransferRoom = true;
    }

    onTransferRoom() {
        if (!this.transferRoom.fromRoomId || !this.transferRoom.toRoomId || !this.transferRoom.option) {
            return;
        }

        this.bookingService.transferRoom(this.transferRoom).subscribe(rs => {
            this.isShowPopupTransferRoom = false;
            AppNotify.success('Transfer room success message');
            this.transferRoom = new TransferRoom();
            this.refresh();
        }, err => {
            this.isShowPopupTransferRoom = false;
            AppNotify.error('Can not transfer room!');
            this.transferRoom = new TransferRoom();
        });
    }

    private allRoomAvailable() {
        const roomArray = this.floors.map(_ => _.rooms);
        this.allRoomsAvailable = [].concat.apply([], roomArray).filter(_ => _.status === RoomStatus.Available);
        this.allRoomsNotAvailable = [].concat.apply([], roomArray).filter(_ => _.status !== RoomStatus.Available);
    }

    refresh() {
        setTimeout(() => {
            this.loadFloor();
            this.listRoomsSelected = [];
        }, 200);
    }

    onDeleteRoomId(roomId: number) {
        const element = document.getElementById(roomId.toString());
        element.classList.remove('selected');
        this.listRoomsSelected = this.listRoomsSelected.filter(_ => _.id !== roomId);
    }

    // onClickItem(item) {
    //     this.bookingService.getBookRoom(this.selectedRoom.id, item.value).subscribe(
    //         (booked-list) => {
    //             this.selectedBooked = booked-list;
    //
    //             switch (item.value) {
    //                 case ActionNavigationType.AddToBookingList:
    //                     // this.store.dispatch(new SetActionType(ActionType.Available));
    //                     this.store.dispatch(new SetBookAvailable(this.selectedBooked));
    //                     break;
    //                 case ActionNavigationType.BookingNow:
    //                     this.store.dispatch(new SetActionType(ActionType.BookingNow));
    //                     this.store.dispatch(new SetEditBooking(this.selectedBooked));
    //                     break;
    //                 case ActionNavigationType.Edit:
    //                     this.store.dispatch(new SetActionType(ActionType.Edit));
    //                     this.store.dispatch(new SetEditBooking(this.selectedBooked));
    //                     break;
    //                 case ActionNavigationType.AddToCheckoutList:
    //                     this.store.dispatch(new SetBookCheckout(this.selectedBooked));
    //                     break;
    //                 case ActionNavigationType.CheckoutNow:
    //                     this.store.dispatch(new SetActionType(ActionType.CheckoutNow));
    //                     this.store.dispatch(new SetEditBooking(this.selectedBooked));
    //                     break;
    //                 case ActionNavigationType.AddToCheckinList:
    //                     this.store.dispatch(new SetActionType(ActionType.Checkout));
    //                     this.store.dispatch(new SetBookCheckin(this.selectedBooked));
    //                     break;
    //                 case ActionNavigationType.TransferRoom:
    //                     this.isShowPopupTransferRoom = true;
    //                     this.transferRoom.fromRoomId = this.selectedBooked.rooms[0].id;
    //                     break;
    //                 case ActionNavigationType.RemoveCheckin:
    //                     this.onHandleRemoveCheckin(this.selectedBooked);
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             this.visible = false;
    //         },
    //         (err) => {
    //             AppNotify.error('Get book went wrong!');
    //         }
    //     );
    // }

    // onHandleRemoveCheckin(book: BookedModel) {
    //     this.bookingService.removeCheckinBook(book).subscribe(() => {
    //         AppNotify.success('Removed checkin book');
    //         this.store.dispatch(new SetActionType(ActionType.None));
    //         this.refresh();
    //     }, err => {
    //         AppNotify.error('Removed checkin book error');
    //     });
    // }

    // showTransferRoomPopup() {
    //     this.transferRoom = new TransferRoom();
    //     this.isShowPopupTransferRoom = true;
    // }

    // onHandleTransfer() {
    //     if (!this.transferRoom.fromRoomId || !this.transferRoom.toRoomId || !this.transferRoom.option) {
    //         return;
    //     }
    //
    //     this.bookingService.transferRoom(this.transferRoom).subscribe(rs => {
    //         this.isShowPopupTransferRoom = false;
    //         AppNotify.success('Transfer room success message');
    //         this.refresh();
    //     }, err => {
    //         this.isShowPopupTransferRoom = false;
    //         AppNotify.error('Can not transfer room!');
    //     });
    //     this.transferRoom = new TransferRoom();
    // }

    // refresh() {
    //     setTimeout(() => {
    //         this.loadFloors();
    //     });
    // }

    // loadFloors() {
    //     this.bookingService.getFloors().subscribe(
    //         (result) => {
    //             console.log(result);
    //             this.store.dispatch(new SetFloor(result));
    //         },
    //         (err) => {
    //             AppNotify.error(err);
    //         }
    //     );
    // }

    // isRoomSingle(room) {
    //     return room.type === RoomType.Single;
    // }
}
