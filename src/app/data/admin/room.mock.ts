import * as faker from 'faker';
import {random} from 'lodash';
//
import {BaseService, BookedModel, CustomerModel, FloorModel, RoomModel, ServiceModel,} from '@app/modules/admin/models/room.model';
import {ActionNavigationType, RoomStatus} from '@app/modules/admin/shared/enums';

export function randomFloors(count: number): FloorModel[] {
    return Array(count)
        .fill({})
        .map((item: FloorModel, index) => {
            return new FloorModel({
                id: index + 1,
                name: 'Lầu ' + (index + 1).toString(),
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
                name: floor.toString() + '0' + (index + 1).toString(),
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
                bookCode: '123',
                isUpdated: false,
                isDeleted: false
            };
        });
}

// TODO remove type
export function randomRoom(roomId: number, type: number): RoomModel {
    if (type === 1) {
        // booking now
        return {
            id: roomId,
            status: RoomStatus.Available,
            name: random(1, 5) + '0' + random(1, 5),
            checkinDate: null,
            checkoutDate: null,
            type: random(1, 2),
            price: 100000,
            deduct: 0,
            prepay: 0,
            note: faker.lorem.sentence(),
            peopleNumber: 0,
            bookCode: null,
            isUpdated: false
        };
    }
    const statusRoom = random(2, 4);

    return {
        id: roomId,
        status: statusRoom,
        name: random(1, 5) + '0' + random(1, 5),
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
        bookCode: '123',
        isUpdated: false
    };
}

export function randomServiceLookup(): BaseService[] {
    return [
        {
            id: 1,
            name: 'bò húc',
            price: 10000,
        },
        {
            id: 2,
            name: 'coca',
            price: 7000,
        },
        {
            id: 3,
            name: 'mì hảo hảo',
            price: 3000,
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
                name: ['bò húc', 'coca', 'hảo hảo'][random(0, 2)]
            });
        });
}

export function randomCustomers(count: number): CustomerModel[] {
    return Array(count)
        .fill({})
        .map((item: CustomerModel, index) => {
            return new CustomerModel({
                id: index + 1,
                name: `customer ${index + 1}`,
                address: faker.address.streetAddress()
            });
        });
}

export function randomBooked(roomId: number, status: ActionNavigationType): BookedModel {
    switch (status) {
        case ActionNavigationType.BookingNow:
            return new BookedModel({
                id: null,
                rooms: [randomRoom(roomId, 1)],
                customers: [],
                services: []
            });
            break;
        case ActionNavigationType.AddToBookingList:
            return new BookedModel({
                id: null,
                rooms: [randomRoom(roomId, 1)],
                customers: [],
                services: []
            });
            break;
        case ActionNavigationType.Edit:
            return new BookedModel({
                id: roomId,
                rooms: [randomRoom(roomId, 2)],
                customers: randomCustomers(random(0, 2)),
                services: randomServices(random(0, 3))
            });
            break;
        case ActionNavigationType.AddToCheckoutList:
            return new BookedModel({
                id: roomId,
                rooms: [randomRoom(roomId, 2)],
                customers: randomCustomers(random(0, 2)),
                services: randomServices(random(0, 3))
            });
            break;
        case ActionNavigationType.CheckoutNow:
            return new BookedModel({
                id: roomId,
                rooms: [randomRoom(roomId, 2)],
                customers: randomCustomers(random(0, 2)),
                services: randomServices(random(0, 3))
            });
            break;
        default:
            return new BookedModel({
                id: roomId,
                rooms: [randomRoom(roomId, 2)],
                customers: randomCustomers(random(0, 2)),
                services: randomServices(random(0, 3))
            });
            break;
    }
}

