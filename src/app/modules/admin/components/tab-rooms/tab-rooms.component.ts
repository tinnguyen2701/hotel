import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DxDataGridComponent, DxPopoverComponent} from 'devextreme-angular';
//
import {RoomModel} from '@app/modules/admin/models';
import {RoomType} from '@app/modules/admin/shared/enums';
import {PopoverConfirmBoxComponent} from '@app/shared/components';
import {BookingService} from '@app/modules/admin/services';

@Component({
    selector: 'app-admin-tab-rooms',
    templateUrl: './tab-rooms.component.html',
    styleUrls: ['./tab-rooms.component.scss']
})
export class TabRoomsComponent implements OnInit {
    private _rooms: RoomModel[] = [];
    //
    @ViewChild('dxDataGridRoom', {static: true}) dxDataGridRoom: DxDataGridComponent;
    @ViewChild('deleteDetailConfirmPopover', {static: true}) confirmDeleteDetailPopover: PopoverConfirmBoxComponent;
    @ViewChild('popoverFindAvailableRooms', {static: true}) findAvailableRoomsPopover: DxPopoverComponent;
    //
    @Input()
    get rooms(): RoomModel[] {
        return this._rooms;
    }

    set rooms(value: RoomModel[]) {
        this._rooms = value;
        this.roomsChange.emit(value);
    }
    //
    @Output() roomsChange = new EventEmitter<RoomModel[]>();
    @Output() onDeleteRoom = new EventEmitter<number>();
    //

    selectedRoomId: number;
    numberOfSingleRooms: number = 0;
    numberOfDoubleRooms: number = 0;
    selectedRoom: RoomModel = new RoomModel();

    constructor(private bookingsService: BookingService) {
    }

    roomTypes: { value: number, name: string }[] = [
        {value: RoomType.Single, name: 'Single Room'},
        {value: RoomType.Double, name: 'Double Room'}
    ];

    ngOnInit() {
    }

    onClickedAddAvailableRooms(e: any) {
        this.findAvailableRoomsPopover.instance.show(e.event.target);
    }

    onRowRoomUpdated(e) {
        e.data.isUpdated = true;
    }

    onRevertDxGridRow = (e) => {
        e.event.preventDefault();
        e.component.cancelEditData();
        e.component.refresh();
    };

    onUpdateRoom = (e) => {
        e.component.editRow(e.row.dataIndex);
    };

    onHandlerDeleteRoom = (e) => {
        e.event.preventDefault();
        const data = e.row.data;
        this.selectedRoom = data;
        // this.selectedRoomId = this.rooms.findIndex(
        //     (detail) => detail.id === data.id
        // );
        if (this.confirmDeleteDetailPopover) {
            this.confirmDeleteDetailPopover.show(e.event.currentTarget);
        }
    };

    deleteRoom() {
        this.onDeleteRoom.emit(this.selectedRoom.id);
    }

    onFindRooms() {
        if (this.numberOfSingleRooms || this.numberOfDoubleRooms) {
            this.bookingsService.findListAvailableRooms(this.numberOfSingleRooms, this.numberOfDoubleRooms).subscribe(rs => {
                this.rooms = rs;
                this.findAvailableRoomsPopover.instance.hide();
            });
        } else {
            this.findAvailableRoomsPopover.instance.hide();
        }
    }
}
