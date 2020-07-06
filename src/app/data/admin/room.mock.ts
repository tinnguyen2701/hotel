import * as faker from "faker";
import { random } from "lodash";
//
import {
    RoomModel,
    FloorModel,
    ServiceBaseLookup,
    ServiceModel,
} from "@app/modules/admin/models/room.model";
import { RoomStatus } from "@app/modules/admin/shared/enums";

export function randomFloors(count: number): FloorModel[] {
    return Array(count)
        .fill({})
        .map((item: FloorModel, index) => {
            return new FloorModel({
                id: index + 1,
                name: "Lầu " + (index + 1).toString(),
                rooms: randomRooms(6, index + 1),
            });
        });
}

export function randomRooms(count: number, floor: number): RoomModel[] {
    return Array(count)
        .fill({})
        .map((item: RoomModel, index) => {
            const statusRoom = random(2, 4);
            return {
                id: index + 1,
                status: statusRoom,
                name: floor.toString() + "0" + (index + 1).toString(),
                checkinDate:
                    statusRoom === RoomStatus.Booking ||
                    statusRoom === RoomStatus.Checkin
                        ? faker.date.past()
                        : null,
                checkoutDate:
                    statusRoom === RoomStatus.Booking ||
                    statusRoom === RoomStatus.Checkin
                        ? faker.date.future()
                        : null,
                type: random(1, 2),
                price: 100000,
                deduct: 0,
                prepay: 0,
                note: faker.lorem.sentence(),
                peopleNumber: 0,
                customerInfomation: null,
            };
        });
}

export function randomRoom(roomId: number, type: number): RoomModel {
    if (type === 1) {
        // booking now
        return {
            id: roomId,
            status: RoomStatus.Available,
            name: random(1, 5) + "0" + random(1, 5),
            checkinDate: null,
            checkoutDate: null,
            type: random(1, 2),
            price: 100000,
            deduct: 0,
            prepay: 0,
            note: faker.lorem.sentence(),
            peopleNumber: 0,
            customerInfomation: null,
        };
    }
    const statusRoom = random(2, 4);

    return {
        id: roomId,
        status: RoomStatus.Available,
        name: random(1, 5) + "0" + random(1, 5),
        checkinDate:
            statusRoom === RoomStatus.Booking ||
            statusRoom === RoomStatus.Checkin
                ? faker.date.past()
                : null,
        checkoutDate:
            statusRoom === RoomStatus.Booking ||
            statusRoom === RoomStatus.Checkin
                ? faker.date.future()
                : null,
        type: random(1, 2),
        price: 100000,
        deduct: 0,
        prepay: 0,
        note: faker.lorem.sentence(),
        peopleNumber: 0,
        customerInfomation: null,
    };
}

export function randomServiceLookup(): ServiceBaseLookup[] {
    return [
        {
            id: 1,
            name: "bò húc",
        },
        {
            id: 2,
            name: "coca",
        },
        {
            id: 3,
            name: "mì hảo hảo",
        },
    ];
}

export function randomServices(count: number): ServiceModel[] {
    return Array(count)
        .fill({})
        .map((item: ServiceModel, index) => {
            const price = random(1, 10) * 10000;
            const quantity = random(1, 10);

            return new ServiceModel({
                id: index + 1,
                serviceId: random(1, 3),
                price,
                quantity,
                amount: price * quantity,
            });
        });
}
