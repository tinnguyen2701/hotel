import { Component, OnInit, Input } from '@angular/core';
import { AppState, SetIsShowListRoom } from '@app/modules/admin/store';
import { RoomModel } from '@app/modules/admin/models';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-popup-list-rooms',
    templateUrl: './popup-list-rooms.component.html',
    styleUrls: ['./popup-list-rooms.component.scss'],
})
export class PopupListRoomsComponent implements OnInit {
    @Input() isShowListRoom: boolean = false;
    @Input() listRooms: RoomModel[];

    isLoading: boolean = false;
    isProcessing: boolean = false;

    constructor(private store: Store) {}

    ngOnInit() {}

    onHiding() {
        this.store.dispatch(new SetIsShowListRoom());
    }
}
