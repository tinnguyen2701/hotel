import {RoomModel, FloorModel} from '@app/modules/admin/models';
import {State, Selector, Action, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
    SetListRoomCheckin,
    SetFloor,
    SetListRoomCheckout,
    SetActionType
} from '../actions/app.action';
import { ActionType } from '../../shared/enums';

export interface AppStateModel {
    listFloors: FloorModel[] | [];
    listRoomsCheckin: RoomModel[] | [];
    listRoomsCheckout: RoomModel[] | [];
    actionType: ActionType;
}

const appStateDefaults: AppStateModel = {
    listFloors: [],
    listRoomsCheckin: [],
    listRoomsCheckout: [],
    actionType: ActionType.None
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
    static listRoomsCheckout(state: AppStateModel) {
        return state.listRoomsCheckout;
    }

    @Selector()
    static actionType(state: AppStateModel) {
        return state.actionType;
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
        if (sc.getState().actionType !== ActionType.Edit) {
            sc.setState({
                ...sc.getState(),
                listRoomsCheckin: [...sc.getState().listRoomsCheckin, action.payload]
            });
        }
    }

    @Action(SetListRoomCheckout)
    SetListRoomCheckout(sc: StateContext<AppStateModel>, action: SetListRoomCheckout) {
        sc.setState({
            ...sc.getState(),
            listRoomsCheckout: [...sc.getState().listRoomsCheckout, action.payload]
        });
    }

    @Action(SetActionType)
    SetActionType(sc: StateContext<AppStateModel>, action: SetActionType) {
        sc.setState({
            ...sc.getState(),
            actionType: action.payload
        });
    }
}
