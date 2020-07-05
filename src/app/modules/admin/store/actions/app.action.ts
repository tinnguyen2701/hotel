
import { RoomModel, FloorModel } from '@app/modules/admin/models';
import { ActionType } from '../../shared/enums';


export class SetFloor {
    static readonly type = '[App] Set list floor';

    constructor(public payload: FloorModel[]) {
    }
}

export class SetListRoomCheckin {
    static readonly type = '[App] Set list room checkin';

    constructor(public payload: RoomModel) {
    }
}

export class SetListRoomCheckout {
    static readonly type = '[App] Set list room checkout';

    constructor(public payload: RoomModel) {
    }
}

export class SetActionType {
    static readonly type = '[App] Set action type';

    constructor(public payload: ActionType) {}
}
