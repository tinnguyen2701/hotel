// 
import { RoomModel } from '@app/modules/admin/models';


export class SetListRoom {
    static readonly type = '[App] Set list room';

    constructor(public payload: RoomModel) {
    }
}
