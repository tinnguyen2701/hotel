import {RoomModel, FloorModel} from '@app/modules/admin/models';
import {State, Selector, Action, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
    SetListRoomCheckin,
    SetIsShowListRoomCheckin,
    SetFloor,
    SetEmptyListRoomCheckin,
    SetEmptyListRoomCheckout,
    SetIsShowListRoomCheckout,
    SetListRoomCheckout
} from '../actions/app.action';

export interface AppStateModel {
    listFloors: FloorModel[] | [];
    listRoomsCheckin: RoomModel[] | [];
    isShowListRoomCheckin: boolean | false;
    listRoomsCheckout: RoomModel[] | [];
    isShowListRoomCheckout: boolean | false;
}

const appStateDefaults: AppStateModel = {
    listFloors: [],
    listRoomsCheckin: [],
    isShowListRoomCheckin: false,
    listRoomsCheckout: [],
    isShowListRoomCheckout: false
};

@State<AppStateModel>({
    name: 'app',
    defaults: appStateDefaults,
})

@Injectable()
export class AppState {
    constructor() {
    }

    @Selector()
    static listFloor(state: AppStateModel) {
        return state.listFloors;
    }

    @Selector()
    static listRoomsCheckin(state: AppStateModel) {
        return state.listRoomsCheckin;
    }

    @Selector()
    static isShowListRoomCheckin(state: AppStateModel) {
        return state.isShowListRoomCheckin;
    }

    @Selector()
    static listRoomsCheckout(state: AppStateModel) {
        return state.listRoomsCheckout;
    }

    @Selector()
    static isShowListRoomCheckout(state: AppStateModel) {
        return state.isShowListRoomCheckout;
    }

    @Action(SetFloor)
    SetFloor(sc: StateContext<AppStateModel>, action: SetFloor) {
        sc.setState({
            ...sc.getState(),
            listFloors: action.payload
        });
    }

    @Action(SetListRoomCheckin)
    SetListRoomCheckin(sc: StateContext<AppStateModel>, action: SetListRoomCheckin) {
        sc.setState({
            ...sc.getState(),
            listRoomsCheckin: [...sc.getState().listRoomsCheckin, action.payload]
        });
    }

    @Action(SetEmptyListRoomCheckin)
    SetEmptyListRoomCheckin(sc: StateContext<AppStateModel>) {
        sc.setState({
            ...sc.getState(),
            listRoomsCheckin: []
        });
    }

    @Action(SetIsShowListRoomCheckin)
    SetIsShowListRoomCheckin(sc: StateContext<AppStateModel>, action: SetIsShowListRoomCheckin) {
        sc.setState({
            ...sc.getState(),
            isShowListRoomCheckin: action.payload
        });
    }

    @Action(SetListRoomCheckout)
    SetListRoomCheckout(sc: StateContext<AppStateModel>, action: SetListRoomCheckout) {
        sc.setState({
            ...sc.getState(),
            listRoomsCheckout: [...sc.getState().listRoomsCheckout, action.payload]
        });
    }

    @Action(SetEmptyListRoomCheckout)
    SetEmptyListRoomCheckout(sc: StateContext<AppStateModel>) {
        sc.setState({
            ...sc.getState(),
            listRoomsCheckout: []
        });
    }

    @Action(SetIsShowListRoomCheckout)
    SetIsShowListRoomCheckout(sc: StateContext<AppStateModel>, action: SetIsShowListRoomCheckout) {
        sc.setState({
            ...sc.getState(),
            isShowListRoomCheckout: action.payload
        });
    }
}
