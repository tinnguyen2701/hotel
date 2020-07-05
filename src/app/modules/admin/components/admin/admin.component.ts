import {Component, OnInit} from '@angular/core';
import {RoomModel} from '../../models';
import {AppState, SetFloor} from '../../store';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
import {RoomService} from '../../services';
import {Store} from '@ngxs/store';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
    @SelectSnapshot(AppState.listRoomsCheckin) listRoomsCheckin: RoomModel[];
    @SelectSnapshot(AppState.isShowListRoomCheckin) isShowListRoomCheckin: boolean;
    @SelectSnapshot(AppState.listRoomsCheckout) listRoomsCheckout: RoomModel[];
    @SelectSnapshot(AppState.isShowListRoomCheckout) isShowListRoomCheckout: boolean;

    constructor(private roomService: RoomService, private store: Store) {
        this.loadFloor();
    }

    ngOnInit() {
        console.log(this.isShowListRoomCheckin);
        console.log(this.isShowListRoomCheckout);
    }

    loadFloor() {
        this.roomService.getFloors().subscribe(
            (result) => {
                this.store.dispatch(new SetFloor(result));
            },
            (err) => {
            }
        );
    }
}
