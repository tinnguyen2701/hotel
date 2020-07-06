import { ServiceBaseLookup } from "./room.model";

export class AppLookupModel {
    services: ServiceBaseLookup[] = [];

    constructor(init?: Partial<AppLookupModel>) {
        Object.assign(this, init);
    }
}
