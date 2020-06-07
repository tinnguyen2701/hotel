import {ISearchDataInterface} from '@app/modules/admin/models/search.model';

export class BoatModel {
    id: number;
    boatId: string;
    boatName: string;
    driverId: string;
    driverName: string;
    driverContactInfo: string;
    organizerId: string;
    organizerName: string;
    ownerId: string;
    ownerName: string;
    region: string;
    departingHarbor1: string;
    departingHarbor2: string;
    pricePackageNumber: number;
    tripCategory: string;
    destination: string;
    note: string;

    public constructor(init?: Partial<BoatModel>) {
        Object.assign(this, init);
    }
}

export class FilterBoatModel implements ISearchDataInterface {
    keyword: string;

    public constructor(init?: Partial<FilterBoatModel>) {
        Object.assign(this, init);
    }
}
