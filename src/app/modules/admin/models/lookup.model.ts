import { BaseLookup } from "./room.model";

export class AppLookupModel {
    services: BaseLookup[] = [];

    constructor(init?: Partial<AppLookupModel>) {
        Object.assign(this, init);
    }
}
