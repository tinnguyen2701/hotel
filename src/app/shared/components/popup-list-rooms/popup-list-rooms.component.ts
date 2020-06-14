import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppState, SetIsShowListRoom } from '@app/modules/admin/store';
import { RoomModel } from '@app/modules/admin/models';
import { Store } from '@ngxs/store';
import { DxDataGridComponent } from 'devextreme-angular';
import { PopoverConfirmBoxComponent } from '..';
import { ROOM_TYPE, ROOM_STATUS_TYPE } from '@app/modules/admin/shared/constant';
import { RoomStatus } from '@app/modules/admin/shared/enums';

@Component({
    selector: 'app-popup-list-rooms',
    templateUrl: './popup-list-rooms.component.html',
    styleUrls: ['./popup-list-rooms.component.scss'],
})
export class PopupListRoomsComponent implements OnInit {
    @ViewChild('dxDataGrid', { static: true }) roomGrid: DxDataGridComponent;
    @ViewChild('deleteDetailConfirmPopover', { static: true })
    confirmDeleteDetailPopover: PopoverConfirmBoxComponent;

    @Input() isShowListRoom: boolean = false;
    @Input() listRooms: RoomModel[];

    isLoading: boolean = false;
    isProcessing: boolean = false;
    selectedRoomId: number = null;
    status: RoomStatus;
    roomTypes = ROOM_TYPE;
    roomStatusTypes = ROOM_STATUS_TYPE;

    totalPeoples: number;

    constructor(private store: Store, private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        console.log(this.listRooms);
        this.roomStatusTypes = this.roomStatusTypes.slice(2, 4);
    }

    onHiding() {
        this.store.dispatch(new SetIsShowListRoom());
    }

    onSaveSkill = (e) => {
        this.listRooms.reverse();
        e.event.preventDefault();
        e.component.saveEditData();
        this.listRooms.reverse();
    };

    onRevertDxGridRow = (e) => {
        e.event.preventDefault();
        e.component.cancelEditData();
        e.component.refresh();
    };

    updateLookupData = (e) => {
        e.component.editRow(e.row.dataIndex);
    };

    onDeleteSkill = (e) => {
        e.event.preventDefault();
        const data = e.row.data;
        if (!Boolean(data.id)) {
            this.roomGrid.instance.deleteRow(
                this.roomGrid.instance.getRowIndexByKey(data)
            );
        } else {
            this.selectedRoomId = this.listRooms.findIndex(
                (detail) => detail.id === data.id
            );
            if (this.confirmDeleteDetailPopover) {
                this.confirmDeleteDetailPopover.show(e.event.currentTarget);
            }
        }
    };

    deleteRoom() {
        this.changeDetectorRef.markForCheck();
        if (this.selectedRoomId !== null) {
            this.listRooms.splice(this.selectedRoomId, 1);
            this.roomGrid.instance.refresh(true);
            this.selectedRoomId = null;
        }
    }
}
