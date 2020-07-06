import { Component, OnInit } from "@angular/core";
import { RoomModel, AppLookupModel } from "../../models";
import { AppState, SetFloor } from "../../store";
import { SelectSnapshot } from "@ngxs-labs/select-snapshot";
import { RoomService, AppLookupService } from "../../services";
import { Store } from "@ngxs/store";
import { ActionType } from "../../shared/enums";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
    @SelectSnapshot(AppState.actionType) actionType: ActionType;
    @SelectSnapshot(AppState.listRoomsCheckin) listRoomsCheckin: RoomModel[];
    @SelectSnapshot(AppState.listRoomsCheckout) listRoomsCheckout: RoomModel[];
    @SelectSnapshot(AppState.editRoom) editingRoom: RoomModel[];

    constructor(
        private roomService: RoomService,
        private store: Store,
        private appLookupService: AppLookupService
    ) {}

    ngOnInit() {
        this.loadFloor();
        this.appLookupService
            .getAppLookup()
            .subscribe((lookup: AppLookupModel) => {
                this.appLookupService.setAppLookup(lookup);
            });
        console.log(this.actionType);
    }

    loadFloor() {
        this.roomService.getFloors().subscribe(
            (result) => {
                this.store.dispatch(new SetFloor(result));
            },
            (err) => {}
        );
    }

    isShowListRoomCheckin() {
        return this.actionType === ActionType.Checkin;
    }

    isShowListRoomCheckout() {
        return this.actionType === ActionType.Checkout;
    }

    isEditRoom() {
        return this.actionType === ActionType.Edit;
    }
}
