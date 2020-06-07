import { ISearchDataInterface } from './search.model';

export class BookModel {
    id: number;
    roomName: string;
    contactName: string;
    checkinDate: Date;
    checkoutDate: Date;
    roomType: number;
    prepay: number;
    note: string;
    createdDate: Date;
    author: string;
    code: string;

    public constructor(init?: Partial<BookModel>) {
        Object.assign(this, init);
    }
}

export class FilterBookModel implements ISearchDataInterface {
    codeBook: string;
    nameRoom: string;
    keyword: string;

    public constructor(init?: Partial<FilterBookModel>) {
        Object.assign(this, init);
    }
}
