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
//
import {
    AppState,
    SetFloor,
    SetActionType, SetEmptyEditBooking, SetEmptyBooking
} from '@app/modules/admin/store';
import {
    RoomModel,
    CustomerModel,
    BaseLookup, BookedModel, ServiceModel,
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

    @Input() book: BookedModel;
    @Input() isShowListRoom: boolean = false;

    isLoading: boolean = false;
    isProcessing: boolean = false;
    selectedRoomId: number = null;
    status: RoomStatus;
    roomTypes = ROOM_TYPE;
    roomStatusTypes = ROOM_STATUS_TYPE;
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

    onSaveSkill = (e) => {
        this.book.rooms.reverse();
        e.event.preventDefault();
        e.component.saveEditData();
        this.book.rooms.reverse();
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
            this.selectedRoomId = this.book.rooms.findIndex(
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
            this.book.rooms.splice(this.selectedRoomId, 1);
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
                    this.refesh();
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
                    this.refesh();
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

    // isEditRoom() {
    //     return this.actionType === ActionType.Edit;
    // }

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
