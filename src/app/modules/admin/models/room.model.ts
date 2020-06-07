export class RoomModel {
    id: number;
    status: number;
    name: string;
    checkinDate: Date;
    checkoutDate: Date;

    public constructor(init?: Partial<RoomModel>) {
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

