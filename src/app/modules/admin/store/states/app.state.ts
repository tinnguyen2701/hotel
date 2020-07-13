import {BookedModel, FloorModel, RoomModel} from '@app/modules/admin/models';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
    SetActionType,
    SetBookCheckout,
    SetFloor,
    SetEmptyBooking,
    SetEmptyEditBooking,
    SetEditBooking,
    SetBookAvailable, SetBookAvailableAndCheckinAndCheckout, SetBookCheckin
} from '../actions/app.action';
import {ActionType} from '../../shared/enums';
import {RoomService} from '../../services';
import {AppNotify} from '@app/utilities';

export interface AppStateModel {
    listFloors: FloorModel[] | [];
    bookAvailable: BookedModel;
    bookCheckin: BookedModel;
    bookCheckout: BookedModel;
    actionType: ActionType;
    editBooking: BookedModel;
}

const appStateDefaults: AppStateModel = {
    listFloors: [],
    bookAvailable: new BookedModel(),
    bookCheckin: new BookedModel(),
    bookCheckout: new BookedModel(),
    actionType: ActionType.None,
    editBooking: null
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
    static bookAvailable(state: AppStateModel) {
        return state.bookAvailable;
    }

    @Selector()
    static bookCheckin(state: AppStateModel) {
        return state.bookCheckin;
    }

    @Selector()
    static bookCheckout(state: AppStateModel) {
        return state.bookCheckout;
    }

    @Selector()
    static actionType(state: AppStateModel) {
        return state.actionType;
    }

    @Selector()
    static editBooking(state: AppStateModel) {
        return state.editBooking;
    }

    @Action(SetFloor)
    SetFloor(sc: StateContext<AppStateModel>, action: SetFloor) {
        sc.setState({
            ...sc.getState(),
            listFloors: action.payload
        });
    }

    @Action(SetBookAvailable)
    SetBookAvailable(sc: StateContext<AppStateModel>, action: SetBookAvailable) {
        const rooms: RoomModel[] = sc.getState().bookAvailable.rooms;

        if (rooms.findIndex(_ => _.id === action.payload.rooms[0].id) === -1) {
            this.roomService.addBook(action.payload, ActionType.Available).subscribe(booked => {
                sc.setState({
                    ...sc.getState(),
                    bookAvailable: {
                        ...sc.getState().bookAvailable,
                        rooms: [...sc.getState().bookAvailable.rooms, ...action.payload.rooms],
                        customers: [...sc.getState().bookAvailable.customers, ...action.payload.customers],
                        services: [...sc.getState().bookAvailable.services, ...action.payload.services]
                    }
                });
            }, (error) => {
                AppNotify.error('Add book error');
            });
        }
    }

    @Action(SetBookCheckin)
    SetBookCheckin(sc: StateContext<AppStateModel>, action: SetBookCheckin) {
        const rooms: RoomModel[] = sc.getState().bookCheckin.rooms;

        if (rooms.findIndex(_ => _.id === action.payload.rooms[0].id) === -1) {
            this.roomService.addBook(action.payload, ActionType.Checkin).subscribe(booked => {
                sc.setState({
                    ...sc.getState(),
                    bookCheckin: {
                        ...sc.getState().bookCheckin,
                        rooms: [...sc.getState().bookCheckin.rooms, ...action.payload.rooms],
                        customers: [...sc.getState().bookCheckin.customers, ...action.payload.customers],
                        services: [...sc.getState().bookCheckin.services, ...action.payload.services]
                    }
                });
            }, (error) => {
                AppNotify.error('Add book checkin error');
            });
        }
    }

    @Action(SetBookCheckout)
    SetBookCheckout(sc: StateContext<AppStateModel>, action: SetBookCheckout) {
        const rooms: RoomModel[] = sc.getState().bookCheckout.rooms;

        if (rooms.findIndex(_ => _.id === action.payload.rooms[0].id) === -1) {
            this.roomService.addBook(action.payload, ActionType.Checkout).subscribe(booked => {
                sc.setState({
                    ...sc.getState(),
                    bookCheckout: {
                        ...sc.getState().bookCheckout,
                        rooms: [...sc.getState().bookCheckout.rooms, ...action.payload.rooms],
                        customers: [...sc.getState().bookCheckout.customers, ...action.payload.customers],
                        services: [...sc.getState().bookCheckout.services, ...action.payload.services]
                    }
                });
            }, (error) => {
                AppNotify.error('Add book error');
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

    @Action(SetEmptyBooking)
    SetEmptyBooking(sc: StateContext<AppStateModel>) {
        if (sc.getState().actionType === ActionType.Available) {
            this.roomService.addBook(new BookedModel(), ActionType.Available).subscribe((rooms) => {
                sc.setState({
                    ...sc.getState(),
                    bookAvailable: new BookedModel()
                });
            }, (error) => {
                AppNotify.error('Set empty book available error');
            });
        } else if (sc.getState().actionType === ActionType.Checkin) {
            this.roomService.addBook(new BookedModel(), ActionType.Checkin).subscribe((rooms) => {
                sc.setState({
                    ...sc.getState(),
                    bookCheckin: new BookedModel()
                });
            }, (error) => {
                AppNotify.error('Set empty book checkin error');
            });
        } else if (sc.getState().actionType === ActionType.Checkout) {
            this.roomService.addBook(new BookedModel(), ActionType.Checkout).subscribe((rooms) => {
                sc.setState({
                    ...sc.getState(),
                    bookCheckout: new BookedModel()
                });
            }, (error) => {
                AppNotify.error('Set empty book checkout error');
            });
        }
    }

    @Action(SetEmptyEditBooking)
    SetEmptyEditBooking(sc: StateContext<AppStateModel>) {
        sc.setState({
            ...sc.getState(),
            editBooking: new BookedModel()
        });
    }

    @Action(SetEditBooking)
    SetEditBooking(sc: StateContext<AppStateModel>, action: SetEditBooking) {
        sc.setState({
            ...sc.getState(),
            editBooking: action.payload
        });
    }

    @Action(SetBookAvailableAndCheckinAndCheckout)
    SetBookAvailableAndCheckinAndCheckout(sc: StateContext<AppStateModel>) {
        this.roomService.getBookCheckinAndCheckout().subscribe((result) => {
            sc.setState({
                ...sc.getState(),
                bookAvailable: result.bookAvailable,
                bookCheckin: result.bookCheckin,
                bookCheckout: result.bookCheckout
            });
        }, (error) => {
            AppNotify.error('Get book available and checkin and checkout error');
        });
    }
}
