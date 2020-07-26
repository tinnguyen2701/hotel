import {BaseService} from './roomModel';

export class AppLookupModel {
    services: BaseService[] = [];

    constructor(init?: Partial<AppLookupModel>) {
        Object.assign(this, init);
    }
}

export class BaseLookup {
    id: number;
    name: string;

    public constructor(init?: Partial<BaseLookup>) {
        Object.assign(this, init);
    }
}
