
import { RoomModel, FloorModel } from '@app/modules/admin/models';


export class SetFloor {
    static readonly type = '[App] Set list floor';

    constructor(public payload: FloorModel[]) {
    }
}

export class SetListRoom {
    static readonly type = '[App] Set list room';

    constructor(public payload: RoomModel) {
    }
}

export class SetIsShowListRoom {
    static readonly type = '[App] Set is show list room';

    constructor(public payload: boolean) {
    }
}

export class SetEmptyListRoom {
    static readonly type = '[App] Set empty list room';

    constructor() {
    }
}
