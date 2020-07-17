import {ChangeDetectorRef, Component, DoCheck, Input, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {cloneDeep, isEqual} from 'lodash';
import {Store} from '@ngxs/store';
import {DxDataGridComponent} from 'devextreme-angular';
import {Subscription} from 'rxjs';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
//
import {AppState, SetActionType, SetEmptyBooking, SetEmptyEditBooking, SetFloor} from '@app/modules/admin/store';
import {BaseLookup, BookedModel, FloorModel, RoomModel, ServiceModel} from '@app/modules/admin/models';
import {PopoverConfirmBoxComponent} from '..';
import {ROOM_STATUS_TYPE, ROOM_TYPE} from '@app/modules/admin/shared/constant';
import {ActionType, RoomStatus} from '@app/modules/admin/shared/enums';
import {AppNotify} from '@app/utilities';
import {BookingService} from '@app/modules/admin/services';


export enum Payment_Method_Types {
    Cash = 1,
    Transfer = 2
}

@Component({
    selector: 'app-popup-list-rooms',
    templateUrl: './popup-list-rooms.component.html',
    styleUrls: ['./popup-list-rooms.component.scss'],
})
export class PopupListRoomsComponent implements OnInit, DoCheck, OnDestroy {
    @SelectSnapshot(AppState.actionType) actionType: ActionType;
    @SelectSnapshot(AppState.listFloor) floors: FloorModel[];

    @ViewChild('dxDataGridRoom', {static: false}) dxDataGridRoom: DxDataGridComponent;
    @ViewChild('deleteDetailConfirmPopover', {static: true}) confirmDeleteDetailPopover: PopoverConfirmBoxComponent;
    @ViewChild('removeCheckinDetailConfirmPopover', {static: true}) removeCheckinDetailConfirmPopover: PopoverConfirmBoxComponent;
    @ViewChild('dxDataGridManageServices', {static: false}) dxDataGridManageServices: DxDataGridComponent;
    @ViewChild('confirmDeleteServiceDetailPopover', {static: false}) confirmDeleteServiceDetailPopover: PopoverConfirmBoxComponent;

    @Input() book: BookedModel;
    @Input() isShowListRoom: boolean = false;

    isLoading: boolean = false;
    isProcessing: boolean = false;

    roomTypes = ROOM_TYPE;
    selectedRoomId: number = null;
    roomStatusTypes = ROOM_STATUS_TYPE;
    isShowBookCodeField: boolean = false;
    paymentServices: number = 0;
    paymentRooms: number = 0;
    roomCheckinSource: BaseLookup[] = [];

    isShowManageServices: boolean = false;
    services: ServiceModel[] = [];
    selectedService: ServiceModel;
    selectedItemServiceIndex: number;

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
    isSelectedDeposit: boolean = false;
    saveAction = {
        Booking: 1,
        Checkin: 2
    };
    paymentMethods = [
        {name: 'Cash', value: Payment_Method_Types.Cash},
        {name: 'Transfer', value: Payment_Method_Types.Transfer}
    ];

    constructor(
        private bookingService: BookingService,
        private store: Store,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.roomStatusTypes = this.roomStatusTypes.slice(2, 4);
        this.bookOriginal = cloneDeep(this.book);
        this.book.paymentMethod = Payment_Method_Types.Cash;
        this.onChangeService();
        this.changeRooms();
        this.floors.map(_ => _.rooms.map(x => x.status === RoomStatus.Checkin && this.roomCheckinSource.push({id: x.id, name: x.name})));
    }

    changeTab(tab) {
        this.currentTab = tab;
    }

    handleTitlePopup() {
        if (this.actionType === ActionType.Available) {
            return 'List available rooms';
        } else if (this.actionType === ActionType.Checkin) {
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
        this.changeRooms();
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
        this.changeRooms();
    }

    //
    // manage services
    showPopupManageServices() {
        this.isShowManageServices = true;
        this.getServices();
    }

    duplicationName = (params) => {
        return this.services.findIndex(x => x.name === params.value.trim() && x.id !== params.data.id) < 0;
    };

    onNewRow() {
        this.dxDataGridManageServices.instance.addRow();
    }

    isRevertButtonVisible = (e) => {
        return e.row.isEditing;
    };

    onEditServiceRow = (e) => {
        this.selectedItemServiceIndex = e.row.rowIndex;
        e.component.instance().editRow(e.row.rowIndex);
    };

    onUpdateServiceRow = (e) => {
        e.event.preventDefault();
        e.component.saveEditData();
    };

    onDxGridRowInserting(e) {
        this.selectedService = e.data;
        this.saveService();
    }

    onDxGridRowUpdating(e) {
        if (e.oldData.id) {
            this.selectedService = new ServiceModel({
                ...e.oldData,
                ...e.newData
            });
            this.saveService();
        }
    }

    onDelete = (e) => {
        const id = e.row.data.id;
        if (!(id)) {
            this.services.splice(e.row.rowIndex, 1);
        } else {
            this.selectedService = e.row.data;
            this.confirmDeleteServiceDetailPopover.show(e.event.currentTarget);
        }
    };

    saveService() {
        let message = '';
        this.bookingService.saveService(this.selectedService).subscribe(() => {
            if (this.selectedService.id) {
                message = 'Updated success';
            } else {
                message = 'Created success';
            }
            AppNotify.success(message);
            this.refreshServices();
        }, err => {
            AppNotify.error('Update error');
            this.refreshServices();
        });
    }

    getServices() {
        this.isLoading = true;
        this.bookingService.getServices().subscribe((rs) => {
            this.services = rs;
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
            AppNotify.error('Get error');
        });
    }

    refreshServices() {
        setTimeout(() => {
            this.getServices();
        });
    }

    onConfirmDeleteService() {
        if (!this.selectedService.id) {
            return false;
        }
        this.bookingService.deleteService(this.selectedService.id).subscribe(() => {
            AppNotify.success('Deleted success');
            this.selectedService = null;
            this.refreshServices();
        }, err => {
            AppNotify.error('Delete error');
        });
    }


    onChangeValuePrice = (newData: RoomModel, value: number, currentRowData) => {
        newData.price = value;
        newData.amount = value - currentRowData.prepay - currentRowData.deduct;
    };

    onChangeValueDeduct = (newData: RoomModel, value: number, currentRowData) => {
        newData.deduct = value;
        newData.amount = currentRowData.price - currentRowData.prepay - value;
    };

    onChangeValuePrepay = (newData: RoomModel, value: number, currentRowData) => {
        newData.prepay = value;
        newData.amount = currentRowData.price - value - currentRowData.deduct;
    };

    customizeTotalValue(e) {
        return (e.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' VND';
    }

    onChangeService() {
        setTimeout(() => {
            this.paymentServices = 0;
            this.book.services.map(_ => {
                if (!_.isDeleted) {
                    this.paymentServices += _.amount;
                }
            });
        });
    }

    changeRooms() {
        setTimeout(() => {
            this.paymentRooms = 0;
            this.book.rooms.map(_ => {
                this.paymentRooms += _.amount;
            });
        });
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

    onConfirmRemoveCheckinList = (e) => {
        if (this.removeCheckinDetailConfirmPopover) {
            this.removeCheckinDetailConfirmPopover.show(e.event.currentTarget);
        }
    };

    onHandleRemoveCheckin() {
        this.bookingService.removeCheckinBook(this.book).subscribe(() => {
            if (this.isShowBookCheckin()) {
                this.store.dispatch(new SetEmptyBooking());
            }
            AppNotify.success('Removed checkin book');

            this.store.dispatch(new SetActionType(ActionType.None));
            this.refresh();
        }, err => {
            AppNotify.error('Removed checkin book error');
        });
    }

    onHandleSaving(saveAction: number) {
        this.book.bookType = saveAction;
        if (this.isEmptyInformation()) {
            return;
        }

        this.bookingService
            .updateBook(this.book)
            .subscribe(
                (account) => {
                    AppNotify.success('Updated success');
                    if (this.isShowBookingNow()) {
                        this.store.dispatch(new SetEmptyEditBooking());
                    } else {
                        this.store.dispatch(new SetEmptyBooking());
                    }
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

        this.bookingService.checkoutBook(this.book)
            .subscribe(() => {
                    AppNotify.success('Checkout success');
                    if (this.isShowCheckoutNow()) {
                        this.store.dispatch(new SetEmptyEditBooking());
                    } else {
                        this.store.dispatch(new SetEmptyBooking());
                    }
                    this.store.dispatch(new SetActionType(ActionType.None));
                    this.refresh();
                }, (error) => {
                    AppNotify.error('Checkout error!');
                }
            );
    }


    onHandleSaveBookEditing() {
        if (this.isEmptyInformation()) {
            return;
        }

        this.bookingService.saveBookEditing(this.book)
            .subscribe(() => {
                    AppNotify.success('Update success');
                    this.store.dispatch(new SetEmptyEditBooking());
                    this.store.dispatch(new SetActionType(ActionType.None));
                    this.refresh();
                }, (error) => {
                    AppNotify.error('Update error!');
                }
            );
    }

    isShowBookAvailable() {
        return this.actionType === ActionType.Available;
    }

    isShowBookCheckin() {
        return this.actionType === ActionType.Checkin;
    }

    isShowBookCheckinNow() {
        return this.actionType === ActionType.CheckinNow;
    }

    isShowBookEdit() {
        return this.actionType === ActionType.Edit;
    }

    isShowBookCheckout() {
        return this.actionType === ActionType.Checkout;
    }

    isShowBookingNow() {
        return this.actionType === ActionType.BookingNow;
    }

    isShowCheckoutNow() {
        return this.actionType === ActionType.CheckoutNow;
    }

    refresh() {
        setTimeout(() => {
            this.loadFloor();
        });
    }

    loadFloor() {
        this.bookingService.getFloors().subscribe(
            (result) => {
                this.store.dispatch(new SetFloor(result));
            },
            (err) => {
            }
        );
    }

    isEmptyInformation() {
        if (!this.book.rooms || this.book.rooms.length === 0
            || !this.book.customers || this.book.customers.length === 0) {
            AppNotify.error('The information is required');
            return true;
        }
        return false;
    }

    ngDoCheck() {
        this.isFormDirty = !isEqual(this.bookOriginal, this.book);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
