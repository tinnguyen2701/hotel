import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    DoCheck,
} from '@angular/core';
import {cloneDeep, isEqual} from 'lodash';
import {Store} from '@ngxs/store';
import {DxDataGridComponent} from 'devextreme-angular';
//
import {AppState, SetIsShowListRoomCheckin, SetFloor, SetIsShowListRoomCheckout} from '@app/modules/admin/store';
import {RoomModel, CustomerModel} from '@app/modules/admin/models';
import {PopoverConfirmBoxComponent} from '..';
import {
    ROOM_TYPE,
    ROOM_STATUS_TYPE,
} from '@app/modules/admin/shared/constant';
import {RoomStatus} from '@app/modules/admin/shared/enums';
import {AppNotify} from '@app/utilities';
import {RoomService} from '@app/modules/admin/services';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';

@Component({
    selector: 'app-popup-list-rooms',
    templateUrl: './popup-list-rooms.component.html',
    styleUrls: ['./popup-list-rooms.component.scss'],
})
export class PopupListRoomsComponent implements OnInit, DoCheck {
    @SelectSnapshot(AppState.isShowListRoomCheckin) isShowListRoomCheckin: boolean;
    @SelectSnapshot(AppState.isShowListRoomCheckout) isShowListRoomCheckout: boolean;

    @ViewChild('dxDataGridRoom', {static: true})
    dxDataGridRoom: DxDataGridComponent;
    @ViewChild('dxDataGridCustomer', {static: true})
    dxDataGridCustomer: DxDataGridComponent;
    @ViewChild('deleteDetailConfirmPopover', {static: true})
    confirmDeleteDetailPopover: PopoverConfirmBoxComponent;

    @Input() listRooms: RoomModel[];
    @Input() isGroup: boolean = true;

    @Input() isShowListRoom: boolean = false;

    @Output() onSuccess = new EventEmitter();

    isLoading: boolean = false;
    isProcessing: boolean = false;
    selectedRoomId: number = null;
    status: RoomStatus;
    roomTypes = ROOM_TYPE;
    roomStatusTypes = ROOM_STATUS_TYPE;
    totalPeoples: number;
    isFormDirty: boolean = false;
    customers: CustomerModel[] = [];
    customerOriginals: CustomerModel[] = [];
    listRoomOriginals: RoomModel[] = [];
    gender = [
        {value: 0, text: 'Female'},
        {value: 1, text: 'Male'},
    ];

    constructor(
        private roomService: RoomService,
        private store: Store,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        console.log(this.isGroup);
        this.roomStatusTypes = this.roomStatusTypes.slice(2, 4);
        this.listRoomOriginals = cloneDeep(this.listRooms);
        this.customerOriginals = cloneDeep(this.customers);
    }

    handleTitlePopup() {
        if (this.isShowListRoomCheckin) {
            return "List checkin rooms";
        } else if (this.isShowListRoomCheckout) {
            return "List checkout rooms";
        }
        return "List rooms";
    }

    onHiding() {
        if (this.isGroup) {
            this.store.dispatch(new SetIsShowListRoomCheckin(false));
            this.store.dispatch(new SetIsShowListRoomCheckout(false));
        } else {
            this.isShowListRoom = !this.isShowListRoom;
        }
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
            this.dxDataGridRoom.instance.deleteRow(
                this.dxDataGridRoom.instance.getRowIndexByKey(data)
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
            this.dxDataGridRoom.instance.refresh(true);
            this.selectedRoomId = null;
        }
    }

    onHandleCancel() {
        if (this.isFormDirty) {
            const confirmTitle = 'Confirm Popup Title';
            const confirmQuestion = 'Cancel Editing Confirm Question';
            AppNotify.confirm(confirmQuestion, confirmTitle).then((result) => {
                if (result) {
                    // this.isShowListRoom = false;
                    this.store.dispatch(new SetIsShowListRoomCheckin(false));
                }
            });
        } else {
            // this.isShowListRoom = false;
            this.store.dispatch(new SetIsShowListRoomCheckin(false));
        }
    }

    onHandleSaving() {
        if (this.isEmptyInfomation()) {
            return;
        }

        this.roomService
            .updateRoom(this.listRooms, this.customers, this.status, this.totalPeoples)
            .subscribe(
                (account) => {
                    AppNotify.success('UpdatedSuccessMessage');
                    this.store.dispatch(new SetIsShowListRoomCheckin(false));
                    this.refesh();
                    // this.onSuccess.emit();
                    // this.isShowListRoom = false;
                },
                (error) => {
                    AppNotify.error(error);
                }
            );
    }

    isEmptyInfomation() {
        return false;
    }

    refesh() {
        setTimeout(() => {
            this.loadFloor();
        });
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

    ngDoCheck() {
        this.isFormDirty = !isEqual(this.listRooms, this.listRoomOriginals) || !isEqual(this.customers, this.customerOriginals);
    }
}
