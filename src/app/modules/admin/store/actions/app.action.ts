
import { RoomModel, FloorModel } from '@app/modules/admin/models';


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

export class SetIsShowListRoomCheckin {
    static readonly type = '[App] Set is show list room checkin';

    constructor(public payload: boolean) {
    }
}

export class SetEmptyListRoomCheckin {
    static readonly type = '[App] Set empty list room checkin';

    constructor() {
    }
}

export class SetListRoomCheckout {
    static readonly type = '[App] Set list room checkout';

    constructor(public payload: RoomModel) {
    }
}

export class SetIsShowListRoomCheckout {
    static readonly type = '[App] Set is show list room checkout';

    constructor(public payload: boolean) {
    }
}

export class SetEmptyListRoomCheckout {
    static readonly type = '[App] Set empty list room checkout';

    constructor() {
    }
}
