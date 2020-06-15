import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectorRef,
    Output,
    EventEmitter,
} from "@angular/core";
import { AppState, SetIsShowListRoom } from "@app/modules/admin/store";
import { RoomModel } from "@app/modules/admin/models";
import { Store } from "@ngxs/store";
import { DxDataGridComponent } from "devextreme-angular";
import { PopoverConfirmBoxComponent } from "..";
import {
    ROOM_TYPE,
    ROOM_STATUS_TYPE,
} from "@app/modules/admin/shared/constant";
import { RoomStatus } from "@app/modules/admin/shared/enums";
import { AppNotify } from "@app/utilities";

@Component({
    selector: "app-popup-list-rooms",
    templateUrl: "./popup-list-rooms.component.html",
    styleUrls: ["./popup-list-rooms.component.scss"],
})
export class PopupListRoomsComponent implements OnInit {
    private _isShowListRoom: boolean = false;

    @ViewChild("dxDataGrid", { static: true }) roomGrid: DxDataGridComponent;
    @ViewChild("deleteDetailConfirmPopover", { static: true })
    confirmDeleteDetailPopover: PopoverConfirmBoxComponent;

    @Input() listRooms: RoomModel[];
    @Input() isGroup: boolean = true;

    @Input()
    get isShowListRoom(): boolean {
        return this._isShowListRoom;
    }

    set isShowListRoom(value: boolean) {
        this._isShowListRoom = value;
        this.isShowListRoomChange.emit(value);
    }

    @Output() isShowListRoomChange = new EventEmitter();

    isLoading: boolean = false;
    isProcessing: boolean = false;
    selectedRoomId: number = null;
    status: RoomStatus;
    roomTypes = ROOM_TYPE;
    roomStatusTypes = ROOM_STATUS_TYPE;
    totalPeoples: number;
    isFormDirty: boolean = false;

    constructor(
        private store: Store,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        console.log(this.listRooms);
        this.roomStatusTypes = this.roomStatusTypes.slice(2, 4);
    }

    onHiding() {
        if (this.isGroup) {
            this.store.dispatch(new SetIsShowListRoom());
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

    onHandleCancel() {
        // if (this.isFormDirty) {
        //     const confirmTitle = "ConfirmPopupTitle";
        //     const confirmQuestion = "CancelEditingConfirmQuestion";
        //     AppNotify.confirm(confirmQuestion, confirmTitle).then((result) => {
        //         if (result) {
        //             this.visible = false;
        //         }
        //     });
        // } else {
        //     this.visible = false;
        // }
    }

    onHandleSaving() {
        if (this.isEmptyInfomation()) {
            return;
        }

        // this.trainingService
        //     .saveTrainingDetail(this.editTrainingDetail)
        //     .subscribe(
        //         (account) => {
        //             const message = this.selectedTrainingId
        //                 ? this.translator.instant(
        //                       marker("UpdatedSuccessMessage")
        //                   )
        //                 : this.translator.instant(
        //                       marker("CreatedSuccessMessage")
        //                   );
        //             AppNotify.success(message);
        //             this.onSuccess.emit(this.editTrainingDetail);
        //             this.visible = false;
        //         },
        //         (error) => {
        //             AppNotify.error(error);
        //         }
        //     );
    }

    isEmptyInfomation() { return false;}
}
