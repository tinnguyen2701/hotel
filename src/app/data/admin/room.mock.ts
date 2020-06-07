import * as faker from 'faker';
import {random} from 'lodash';
//
import { RoomModel, FloorModel } from '@app/modules/admin/models/room.model';

export function randomFloors(count: number): FloorModel[] {
    return Array(count).fill({}).map((item: FloorModel, index) => {
        return new FloorModel({
            id: index + 1,
            name: 'Lầu ' + (index + 1).toString(),
            rooms: randomRooms(5, index + 1)
        });
    });
}

export function randomRooms(count: number, floor: number): RoomModel[] {
    return Array(count).fill({}).map((item: RoomModel, index) => {
        return new RoomModel({
            id: index + 1,
            status: random(2, 4),
            name: floor.toString() + '0' + (index + 1).toString(),
            checkinDate: faker.date.past(),
            checkoutDate: faker.date.future(),
        });
    });
}
