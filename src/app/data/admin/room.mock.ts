import * as faker from 'faker';
import {random} from 'lodash';
//
import { RoomModel, FloorModel } from '@app/modules/admin/models/room.model';
import { RoomStatus } from '@app/modules/admin/shared/enums';

export function randomFloors(count: number): FloorModel[] {
    return Array(count).fill({}).map((item: FloorModel, index) => {
        return new FloorModel({
            id: index + 1,
            name: 'Lầu ' + (index + 1).toString(),
            rooms: randomRooms(6, index + 1)
        });
    });
}

export function randomRooms(count: number, floor: number): RoomModel[] {
    return Array(count).fill({}).map((item: RoomModel, index) => {
        const statusRoom =  random(2, 4);
        return new RoomModel({
            id: index + 1,
            status: statusRoom,
            name: floor.toString() + '0' + (index + 1).toString(),
            checkinDate: (statusRoom === RoomStatus.Booking || statusRoom === RoomStatus.Checkin) ? faker.date.past() : null,
            checkoutDate: (statusRoom === RoomStatus.Booking || statusRoom === RoomStatus.Checkin) ? faker.date.future() : null,
        });
    });
}