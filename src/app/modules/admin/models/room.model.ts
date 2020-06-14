export  interface RoomModel {
    id: number;
    status: number;
    name: string;
    checkinDate: Date;
    checkoutDate: Date;
    type: number;
    price: number;
    deduct: number;
    prepay: number;
    note: string;
    peopleNumber: number;

    customerInfomation: CustomerModel;

    // public constructor(init?: Partial<RoomModel>) {
    //     Object.assign(this, init);
    // }
}

export class CustomerModel {
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

    public constructor(init?: Partial<CustomerModel>) {
        Object.assign(this, init);
    }
}

export class FloorModel {
    id: number;
    name: string;
    rooms: RoomModel[];

    public constructor(init?: Partial<FloorModel>) {
        Object.assign(this, init);
    }
}

