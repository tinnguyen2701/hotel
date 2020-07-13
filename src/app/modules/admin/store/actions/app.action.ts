
import {FloorModel, BookedModel} from '@app/modules/admin/models';
import { ActionType } from '../../shared/enums';


export class SetFloor {
    static readonly type = '[App] Set list floor';

    constructor(public payload: FloorModel[]) {
    }
}

export class SetBookAvailable {
    static readonly type = '[App] Set book available';

    constructor(public payload: BookedModel) {
    }
}

export class SetBookCheckin {
    static readonly type = '[App] Set book checkin';

    constructor(public payload: BookedModel) {
    }
}

export class SetBookCheckout {
    static readonly type = '[App] Set book checkout';

    constructor(public payload: BookedModel) {
    }
}

export class SetActionType {
    static readonly type = '[App] Set action type';

    constructor(public payload: ActionType) {}
}

export class SetEmptyBooking {
    static readonly type = '[App] Set empty booking';

    constructor() {}
}


export class SetEmptyEditBooking {
    static readonly type = '[App] Set empty edit booking';

    constructor() {}
}


export class SetEditBooking {
    static readonly type = '[App] Set edit booking';

    constructor(public payload: BookedModel) {
    }
}

export class SetBookAvailableAndCheckinAndCheckout {
    static readonly type = '[App] Set book available and checkin and checkout';

    constructor() {}
}
