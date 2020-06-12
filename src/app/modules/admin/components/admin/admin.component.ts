import { Component, OnInit } from "@angular/core";
import { RoomModel } from "../../models";
import { AppState } from "../../store";
import { SelectSnapshot } from "@ngxs-labs/select-snapshot";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
    @SelectSnapshot(AppState.listRoom) listRoom: RoomModel[];
    @SelectSnapshot(AppState.isShowListRoom) isShowListRoom: boolean;

    constructor() {}

    ngOnInit() {}
}
