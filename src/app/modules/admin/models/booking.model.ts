import {StatusBooking} from '@app/modules/admin/shared/enums';
import {ISearchDataInterface} from '@app/modules/admin/models/search.model';

export class BookingModel {
    id: number;
    bookingID: number;
    dateBooking: Date;
    region: string;
    departingHarbor: string;
    departingDate: Date;
    pickupTime: Date;
    userID: string;
    userName: string;
    driverID: string;
    driverName: string;
    boatID: string;
    boatName: string;
    activities: string[];
    price: number;
    status: StatusBooking;
    discountApplied: number;
    income: number;
    overnightN?: number;
    overnightD?: number;

    public constructor(init?: Partial<BookingModel>) {
        Object.assign(this, init);
    }
}

export class FilterBookingModel implements ISearchDataInterface {
    keyword: string;

    public constructor(init?: Partial<FilterBookingModel>) {
        Object.assign(this, init);
    }
}
