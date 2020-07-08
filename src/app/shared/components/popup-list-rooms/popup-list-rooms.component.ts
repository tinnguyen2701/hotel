import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    DoCheck,
    OnDestroy,
} from '@angular/core';
import {cloneDeep, isEqual} from 'lodash';
import {Store} from '@ngxs/store';
import {DxDataGridComponent, DxTabsComponent} from 'devextreme-angular';
import {Subscription} from 'rxjs';
//
import {
    AppState,
    SetFloor,
    SetActionType,
    SetEmptyListRoom,
    SetEmptyEditRoom,
} from '@app/modules/admin/store';
import {
    RoomModel,
    CustomerModel,
    ServiceBaseLookup,
} from '@app/modules/admin/models';
import {PopoverConfirmBoxComponent} from '..';
import {
    ROOM_TYPE,
    ROOM_STATUS_TYPE,
} from '@app/modules/admin/shared/constant';
import {RoomStatus, ActionType} from '@app/modules/admin/shared/enums';
import {AppNotify} from '@app/utilities';
import {RoomService, AppLookupService} from '@app/modules/admin/services';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';

@Component({
    selector: 'app-popup-list-rooms',
    templateUrl: './popup-list-rooms.component.html',
    styleUrls: ['./popup-list-rooms.component.scss'],
})
export class PopupListRoomsComponent implements OnInit, DoCheck, OnDestroy {
    @SelectSnapshot(AppState.actionType) actionType: ActionType;

    @ViewChild('dxDataGridRoom', {static: true}) dxDataGridRoom: DxDataGridComponent;
    @ViewChild('deleteDetailConfirmPopover', {static: true}) confirmDeleteDetailPopover: PopoverConfirmBoxComponent;

    @Input() listRooms: RoomModel[];
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

    subscription: Subscription = new Subscription();
    serviceSource: ServiceBaseLookup[] = [];

    Customer = 1;
    Service = 2;
    menuTabs = [
        {
            value: this.Customer,
            text: 'Customer',
            enableHistory: true,
            visited: true,
        },
        {
            value: this.Service,
            text: 'Service',
            enableHistory: true,
            visited: true,
        },
    ];
    currentTab = this.menuTabs[0];

    constructor(
        private roomService: RoomService,
        private store: Store,
        private changeDetectorRef: ChangeDetectorRef,
        private appLookupService: AppLookupService
    ) {
    }

    ngOnInit() {
        this.roomStatusTypes = this.roomStatusTypes.slice(2, 4);
        this.listRoomOriginals = cloneDeep(this.listRooms);
        this.customerOriginals = cloneDeep(this.customers);
    }

    changeTab(tab) {
        this.currentTab = tab;
    }

    handleTitlePopup() {
        if (this.actionType === ActionType.Checkin) {
            return 'List checkin rooms';
        } else if (this.actionType === ActionType.Checkout) {
            return 'List checkout rooms';
        } else if (this.actionType === ActionType.Edit) {
            return 'Edit room';
        }
    }

    onHiding() {
        this.store.dispatch(new SetActionType(ActionType.None));
        this.store.dispatch(new SetEmptyEditRoom());
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
                    this.store.dispatch(new SetActionType(ActionType.None));
                }
            });
        } else {
            this.store.dispatch(new SetActionType(ActionType.None));
        }
        this.store.dispatch(new SetEmptyEditRoom());
    }

    onHandleSaving() {
        if (this.isEmptyInfomation()) {
            return;
        }

        this.roomService
            .updateRoom(
                this.listRooms,
                this.customers,
                this.status,
                this.totalPeoples
            )
            .subscribe(
                (account) => {
                    AppNotify.success('UpdatedSuccessMessage');
                    this.store.dispatch(new SetEmptyListRoom());
                    this.store.dispatch(new SetEmptyEditRoom());
                    this.store.dispatch(new SetActionType(ActionType.None));
                    this.refesh();
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
        this.isFormDirty =
            !isEqual(this.listRooms, this.listRoomOriginals) ||
            !isEqual(this.customers, this.customerOriginals);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
