import {ISearchDataInterface} from '@app/modules/admin/models/search.model';

export class PartnerModel {
    id: number;
    userID: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: number;
    whatsapp: number;
    role: string;
    region: string;
    harbor: string;
    otherMessengerType: number;
    otherMessengerName: string;
    preferredWayOfContact: string;
    category: number;
    organization: string;
    public constructor(init?: Partial<PartnerModel>) {
        Object.assign(this, init);
    }
}

export class FilterPartnerModel implements ISearchDataInterface {
    id: number;
    keyword: string;

    public constructor(init?: Partial<FilterPartnerModel>) {
        Object.assign(this, init);
    }
}

export class OtherMessengerModel {
    id: number;
    value: string;

    public constructor(init?: Partial<OtherMessengerModel>) {
        Object.assign(this, init);
    }
}

export class CategoryModel {
    id: number;
    value: string;

    public constructor(init?: Partial<OtherMessengerModel>) {
        Object.assign(this, init);
    }
}
