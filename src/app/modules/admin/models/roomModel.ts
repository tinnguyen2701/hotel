import { ISearchDataInterface } from './search.model';

export class FloorModel {
    id: number;
    name: string;
    rooms: RoomModel[];

    public constructor(init?: Partial<FloorModel>) {
        Object.assign(this, init);
    }
}

export class RoomModel {
    id: number;
    status: number;
    name: string;
    checkinDate: Date;
    checkoutDate: Date;
    type: number;
    price: number;
    note: string;
    peopleNumber: number;
    bookCode: string;
    amount: number;

    // only UI
    isUpdated: boolean;

    public constructor(init?: Partial<RoomModel>) {
        Object.assign(this, init);
    }
}

export class QuerySearchingModel {
    roomType: number;
    fromDate: Date;
    toDate: Date;

    public constructor(init?: Partial<QuerySearchingModel>) {
        Object.assign(this, init);
    }
}

export class CustomerModel {
    id: number;
    name: string;
    address: string;
    sex: boolean;
    email: string;
    date: Date;
    cmnd: string;
    phone: string;
    nationally: string;
    peopleNumber: number;
    note: string;

    // UI only
    isUpdated: boolean;
    isDeleted: boolean;
    isInserted: boolean;

    public constructor(init?: Partial<CustomerModel>) {
        Object.assign(this, init);
    }
}

export class ServiceModel {
    id: number;
    serviceId: number;
    price: number;
    quantity: number;
    amount: number;
    name: string;

    // UI only
    isUpdated: boolean;
    isDeleted: boolean;
    isInserted: boolean;

    public constructor(init?: Partial<ServiceModel>) {
        Object.assign(this, init);
    }
}


export class BaseService {
    id: number;
    name: string;
    price: number;

    public constructor(init?: Partial<BaseService>) {
        Object.assign(this, init);
    }
}

export class BookedModel {
    id: number;
    code: string;
    bookType: number; // personal or group
    status: number; // booking , checkin or checkout
    name: string;
    checkinDate: Date;
    checkoutDate: Date;
    companyName: string;
    rooms: RoomModel[] = [];
    customers: CustomerModel[] = [];
    services: ServiceModel[] = [];
    prepay: number;
    deduct: number;
    paymentMethod: number;
    note: string;
    roomId: number;
    roomType: number;
    roomPrice: number;
    peopleNumber: number;

    public constructor(init?: Partial<BookedModel>) {
        Object.assign(this, init);
    }
}

export class TransferRoom {
    fromRoomId: number;
    toRoomId: number;
    option: number;

    public constructor(init?: Partial<TransferRoom>) {
        Object.assign(this, init);
    }
}

export class RevenueModel {
    month: string;
    amount: number;

    public constructor(init?: Partial<RevenueModel>) {
        Object.assign(this, init);
    }
}

export class FilterBookModel implements ISearchDataInterface {
    keyword: string;
    fromDate: Date;
    toDate: Date;

    public constructor(init?: Partial<FilterBookModel>) {
        Object.assign(this, init);
    }
}
