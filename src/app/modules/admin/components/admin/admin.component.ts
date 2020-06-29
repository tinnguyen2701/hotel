import { Component, OnInit } from "@angular/core";
import { RoomModel } from "../../models";
import { AppState, SetFloor } from "../../store";
import { SelectSnapshot } from "@ngxs-labs/select-snapshot";
import { RoomService } from '../../services';
import { Store } from '@ngxs/store';

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
    @SelectSnapshot(AppState.listRooms) listRooms: RoomModel[];
    @SelectSnapshot(AppState.isShowListRoom) isShowListRoom: boolean;

    constructor(private roomService: RoomService, private store: Store) {
        this.loadFloor();
    }

    ngOnInit() {}

    loadFloor() {
        this.roomService.getFloors().subscribe(
            (result) => {
                this.store.dispatch(new SetFloor(result));
            },
            (err) => {}
        );
    }
}
