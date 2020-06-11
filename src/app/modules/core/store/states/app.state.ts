import { RoomModel } from '@app/modules/admin/models';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetListRoom } from '..';

export interface AppStateModel {
    listRoom: RoomModel[] | [];
}

const appStateDefaults: AppStateModel = {
    listRoom: [],
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

    @Action(SetListRoom)
    SetListRoom(sc: StateContext<AppStateModel>, action: SetListRoom) {
        // patchState({
        //     listRoom: [action.payload.room]
        // });
        sc.setState({
            ...sc.getState(),
            ...action.payload,
        });
    }
}
