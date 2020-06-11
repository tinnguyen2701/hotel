
import { RoomModel } from '@app/modules/admin/models';


export class SetListRoom {
    static readonly type = '[App] Set list room';

    constructor(public payload: RoomModel) {
    }
}

export class SetIsShowListRoom {
    static readonly type = '[App] Set is show list room';

    constructor() {
    }
}
