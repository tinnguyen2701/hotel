import {FloorModel, RoomModel} from '@app/modules/admin/models';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {SetActionType, SetEmptyListRoom, SetFloor, SetListRoomCheckin, SetListRoomCheckout, SetEditRoom, SetListRoomCheckinAndCheckout} from '../actions/app.action';
import {ActionType} from '../../shared/enums';
import { RoomService } from '../../services';
import { AppNotify } from '@app/utilities';

export interface AppStateModel {
    listFloors: FloorModel[] | [];
    listRoomsCheckin: RoomModel[] | [];
    listRoomsCheckout: RoomModel[] | [];
    actionType: ActionType;
    editRoom: RoomModel[];
}

const appStateDefaults: AppStateModel = {
    listFloors: [],
    listRoomsCheckin: [],
    listRoomsCheckout: [],
    actionType: ActionType.None,
    editRoom: []
};

@State<AppStateModel>({
    name: 'app',
    defaults: appStateDefaults,
})

@Injectable()
export class AppState {
    constructor(private roomService: RoomService) {
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

    @Selector()
    static editRoom(state: AppStateModel) {
        return state.editRoom;
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
        const listRoomsCheckin: RoomModel[] = sc.getState().listRoomsCheckin;

        if (listRoomsCheckin.findIndex(_ => _.id === action.payload.id) === -1) {
            this.roomService.addListRoom([...listRoomsCheckin, action.payload], ActionType.Checkin).subscribe((rooms) => {
                sc.setState({
                    ...sc.getState(),
                    listRoomsCheckin: rooms
                });
            }, (error) => {
                AppNotify.error('Add List Room Error');
            });
        }
    }

    @Action(SetListRoomCheckout)
    SetListRoomCheckout(sc: StateContext<AppStateModel>, action: SetListRoomCheckout) {
        const listRoomsCheckout: RoomModel[] = sc.getState().listRoomsCheckout;

        if (listRoomsCheckout.findIndex(_ => _.id === action.payload.id) === -1) {
            this.roomService.addListRoom([...listRoomsCheckout, action.payload], ActionType.Checkout).subscribe((rooms) => {
                sc.setState({
                    ...sc.getState(),
                    listRoomsCheckout: rooms
                });
            }, (error) => {
                AppNotify.error('Add List Room Error');
            });
        }
    }

    @Action(SetActionType)
    SetActionType(sc: StateContext<AppStateModel>, action: SetActionType) {
        sc.setState({
            ...sc.getState(),
            actionType: action.payload
        });
    }

    @Action(SetEmptyListRoom)
    SetEmptyListRoom(sc: StateContext<AppStateModel>) {
        if (sc.getState().actionType === ActionType.Checkin) {
            this.roomService.addListRoom([], ActionType.Checkout).subscribe((rooms) => {
                sc.setState({
                    ...sc.getState(),
                    listRoomsCheckin: []
                });
            }, (error) => {
                AppNotify.error('Add List Room Error');
            });
        }

        if (sc.getState().actionType === ActionType.Checkout) {
            this.roomService.addListRoom([], ActionType.Checkout).subscribe((rooms) => {
                sc.setState({
                    ...sc.getState(),
                    listRoomsCheckout: []
                });
            }, (error) => {
                AppNotify.error('Add List Room Error');
            });
        }
    }

    @Action(SetEditRoom)
    SetEditRoom(sc: StateContext<AppStateModel>, action: SetEditRoom) {
        sc.setState({
            ...sc.getState(),
            editRoom: [action.payload]
        });
    }

    @Action(SetListRoomCheckinAndCheckout)
    SetListRoomCheckinAndCheckout(sc: StateContext<AppStateModel>) {
        this.roomService.getListRoom([], ActionType.Checkout).subscribe((result) => {
            sc.setState({
                ...sc.getState(),
                listRoomsCheckin: result.listRoomCheckin,
                listRoomsCheckout: result.listRoomCheckout
            });
        }, (error) => {
            AppNotify.error('Get List Room Error');
        });
    }
}
