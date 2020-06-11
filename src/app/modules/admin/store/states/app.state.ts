import { RoomModel } from '@app/modules/admin/models';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetListRoom, SetIsShowListRoom } from '..';

export interface AppStateModel {
    listRoom: RoomModel[] | [];
    isShowListRoom: boolean | false;
}

const appStateDefaults: AppStateModel = {
    listRoom: [],
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
    static listRoom(state: AppStateModel) {
        return state.listRoom;
    }

    @Selector()
    static isShowListRoom(state: AppStateModel) {
        return state.isShowListRoom;
    }

    @Action(SetListRoom)
    SetListRoom(sc: StateContext<AppStateModel>, action: SetListRoom) {
        sc.setState({
            ...sc.getState(),
            listRoom: [...sc.getState().listRoom, action.payload]
        });
    }


    @Action(SetIsShowListRoom)
    SetIsShowListRoom(sc: StateContext<AppStateModel>) {
        sc.setState({
            ...sc.getState(),
            isShowListRoom: !sc.getState().isShowListRoom
        });
    }
}
