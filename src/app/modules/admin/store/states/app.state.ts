import { RoomModel, FloorModel } from '@app/modules/admin/models';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetListRoom, SetIsShowListRoom, SetFloor, SetEmptyListRoom } from '../actions/app.action';

export interface AppStateModel {
    listfloors: FloorModel[] | [];
    listRooms: RoomModel[] | [];
    isShowListRoom: boolean | false;
}

const appStateDefaults: AppStateModel = {
    listfloors: [],
    listRooms: [],
    isShowListRoom: false
};

@State<AppStateModel>({
    name: 'app',
    defaults: appStateDefaults,
})

@Injectable()
export class AppState {
    constructor() {}

    @Selector()
    static listFloor(state: AppStateModel) {
        return state.listfloors;
    }

    @Selector()
    static listRooms(state: AppStateModel) {
        return state.listRooms;
    }

    @Selector()
    static isShowListRoom(state: AppStateModel) {
        return state.isShowListRoom;
    }

    @Action(SetFloor)
    SetFloor(sc: StateContext<AppStateModel>, action: SetFloor) {
        sc.setState({
            ...sc.getState(),
            listfloors: action.payload
        });
    }

    @Action(SetListRoom)
    SetListRoom(sc: StateContext<AppStateModel>, action: SetListRoom) {
        sc.setState({
            ...sc.getState(),
            listRooms: [...sc.getState().listRooms, action.payload]
        });
    }

    @Action(SetEmptyListRoom)
    SetEmptyListRoom(sc: StateContext<AppStateModel>) {
        sc.setState({
            ...sc.getState(),
            listRooms: []
        });
    }

    @Action(SetIsShowListRoom)
    SetIsShowListRoom(sc: StateContext<AppStateModel>, action: SetIsShowListRoom) {
        sc.setState({
            ...sc.getState(),
            isShowListRoom: action.payload
        });
    }


}
