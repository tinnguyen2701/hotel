import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectorRef,
    DoCheck,
    OnDestroy,
} from '@angular/core';
import {cloneDeep, isEqual} from 'lodash';
import {Store} from '@ngxs/store';
import {DxDataGridComponent} from 'devextreme-angular';
import {Subscription} from 'rxjs';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
//
import {
    AppState,
    SetFloor,
    SetActionType, SetEmptyEditBooking, SetEmptyBooking
} from '@app/modules/admin/store';
import {
    RoomModel, BookedModel
} from '@app/modules/admin/models';
import {PopoverConfirmBoxComponent} from '..';
import {
    ROOM_TYPE,
    ROOM_STATUS_TYPE,
} from '@app/modules/admin/shared/constant';
import {RoomStatus, ActionType} from '@app/modules/admin/shared/enums';
import {AppNotify} from '@app/utilities';
import {RoomService} from '@app/modules/admin/services';

@Component({
    selector: 'app-popup-list-rooms',
    templateUrl: './popup-list-rooms.component.html',
    styleUrls: ['./popup-list-rooms.component.scss'],
})
export class PopupListRoomsComponent implements OnInit, DoCheck, OnDestroy {
    @SelectSnapshot(AppState.actionType) actionType: ActionType;

    @ViewChild('dxDataGridRoom', {static: false}) dxDataGridRoom: DxDataGridComponent;
    @ViewChild('deleteDetailConfirmPopover', {static: true}) confirmDeleteDetailPopover: PopoverConfirmBoxComponent;

    @Input() book: BookedModel;
    @Input() isShowListRoom: boolean = false;

    isLoading: boolean = false;
    isProcessing: boolean = false;

    status: RoomStatus;
    roomTypes = ROOM_TYPE;
    selectedRoomId: number = null;
    roomStatusTypes = ROOM_STATUS_TYPE;
    isShowBookCodeField: boolean = false;

    isFormDirty: boolean = false;
    bookOriginal: BookedModel;
    subscription: Subscription = new Subscription();

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
    saveAction = {
        Booking: 1,
        Checkin: 2
    };

    constructor(
        private roomService: RoomService,
        private store: Store,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.roomStatusTypes = this.roomStatusTypes.slice(2, 4);
        this.bookOriginal = cloneDeep(this.book);
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
        this.store.dispatch(new SetEmptyEditBooking());
    }

    //
    // List room action
    setValueCheckin(cell: any, e: any) {
        cell.setValue(e.value);
    }

    setValueCheckout(cell: any, e: any) {
        cell.setValue(e.value);
    }

    onListRoomValidation(e: any) {
        if (!e.isValid || !e.newData) {
            return false;
        }

        let newData: RoomModel = cloneDeep(e.newData);
        const oldData: RoomModel = cloneDeep(e.oldData);
        if (oldData) {
            newData = Object.assign(oldData, newData);
        }

        const columns = e.component.getVisibleColumns();
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].allowEditing) {
                if (!this.hasCellData(e, newData, columns[i])) {
                    return;
                }

                if (columns[i].dataField === 'checkoutDate') {
                    if (!this.shouldValueCheckinSmallerThanCheckout(e, newData.checkinDate, newData.checkoutDate, columns[i])) {
                        return;
                    }
                }
            }
        }
    }

    shouldValueCheckinSmallerThanCheckout(e: any, checkinDate: Date, checkoutDate: Date, column: any) {
        if (checkinDate.getTime() > checkoutDate.getTime()) {
            const message = `${column.caption.toUpperCase()} must be than CHECKIN DATE`;
            this.setRowInvalid(e, message, column.index);
            return false;
        }
        return true;
    }

    private hasCellData(e: any, data: RoomModel, column: any): boolean {
        if (column.dataField !== 'prepay' && column.dataField !== 'price'
            && column.dataField !== 'deduct' && column.dataField !== 'peopleNumber' && !data[column.dataField]) {
            const message = `This column ${column.caption.toUpperCase()} is required`;
            this.setRowInvalid(e, message, column.index);
            return false;
        }
        return true;
    }

    private setRowInvalid(e: any, message, columnIndex) {
        e.isValid = false;
        e.errorText = message;
        this.focusCell(e.component.getRowIndexByKey(e.key), columnIndex, false);
    }

    private focusCell(rowIndex = 0, cellIndex, isFocusedRow = true) {
        if (isFocusedRow) {
            this.dxDataGridRoom.instance.editRow(rowIndex);
        }
        const cell = this.dxDataGridRoom.instance.getCellElement(rowIndex, cellIndex);
        this.dxDataGridRoom.instance.editCell(rowIndex, cellIndex);
        this.dxDataGridRoom.instance.focus(cell);
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

    onDeleteRoom = (e) => {
        e.event.preventDefault();
        const data = e.row.data;
        this.selectedRoomId = this.book.rooms.findIndex(
            (detail) => detail.id === data.id
        );
        if (this.confirmDeleteDetailPopover) {
            this.confirmDeleteDetailPopover.show(e.event.currentTarget);
        }
    };

    deleteRoom() {
        this.changeDetectorRef.markForCheck();
        if (this.selectedRoomId !== null) {
            this.book.rooms.splice(this.selectedRoomId, 1);
            this.dxDataGridRoom.instance.refresh(true);
            this.selectedRoomId = null;
        }
    }


    //
    //
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
        this.store.dispatch(new SetEmptyEditBooking());
    }

    onHandleSaving(saveAction: number) {
        this.book.bookType = saveAction;
        if (this.isEmptyInformation()) {
            return;
        }

        this.roomService
            .updateBook(this.book)
            .subscribe(
                (account) => {
                    AppNotify.success('UpdatedSuccessMessage');
                    this.store.dispatch(new SetEmptyBooking());
                    this.store.dispatch(new SetEmptyEditBooking());
                    this.store.dispatch(new SetActionType(ActionType.None));
                    this.refresh();
                },
                (error) => {
                    AppNotify.error(error);
                }
            );
    }

    onHandleCheckout() {
        if (this.isEmptyInformation()) {
            return;
        }

        this.roomService.checkoutBook(this.book)
            .subscribe(() => {
                    AppNotify.success('Checkout success');
                    this.store.dispatch(new SetEmptyBooking());
                    this.store.dispatch(new SetEmptyEditBooking());
                    this.store.dispatch(new SetActionType(ActionType.None));
                    this.refresh();
                }, (error) => {
                    AppNotify.error('Checkout error!');
                }
            );
    }

    isShowBookCheckin() {
        return this.actionType === ActionType.Checkin;
    }

    isShowBookCheckout() {
        return this.actionType === ActionType.Checkout;
    }

    refresh() {
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


    isEmptyInformation() {
        return false;
    }

    ngDoCheck() {
        this.isFormDirty = !isEqual(this.bookOriginal, this.book);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
