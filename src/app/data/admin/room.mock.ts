import * as faker from 'faker';
import {random} from 'lodash';
//
import {
    BaseService,
    BookedModel,
    CustomerModel,
    FloorModel,
    RevenueModel,
    RoomModel,
    ServiceModel
} from '@app/modules/admin/models/roomModel';
import {ActionNavigationType, RoomStatus} from '@app/modules/admin/shared/enums';

export function randomFloors(count: number): FloorModel[] {
    return Array(count)
        .fill({})
        .map((item: FloorModel, index) => {
            return new FloorModel({
                id: index + 1,
                name: 'Floor ' + (index + 1).toString(),
                rooms: randomRooms(6, index + 1),
            });
        });
}

export function randomRooms(count: number, floor: number): RoomModel[] {
    return Array(count)
        .fill({})
        .map((item: RoomModel, index) => {
            const statusRoom = random(1, 3);
            return {
                id: parseInt(floor.toString() + '0' + (index + 1).toString(), 10),
                status: statusRoom,
                name: floor.toString() + '0' + (index + 1).toString(),
                checkinDate: statusRoom !== RoomStatus.Available ? faker.date.past() : null,
                checkoutDate: statusRoom !== RoomStatus.Available ? faker.date.future() : null,
                type: random(2, 3),
                price: 100000,
                deduct: 0,
                prepay: 0,
                note: faker.lorem.sentence(),
                peopleNumber: 0,
                bookCode: statusRoom !== RoomStatus.Available ? random('A', 'B', 'C') + random(10, 100) : null,
                isUpdated: false,
                isDeleted: false,
                amount: 0
            };
        });
}

/////////////////////// here today
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
            isUpdated: false,
            amount: 10000
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
        isUpdated: false,
        amount: 10000
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


export function getRevenueModel(): RevenueModel[] {
    return [{
        month: 'Jan',
        amount: 3
    }, {
        month: 'Feb',
        amount: 2
    }, {
        month: 'Mar',
        amount: 3
    }, {
        month: 'Apr',
        amount: 4
    }, {
        month: 'May',
        amount: 6
    }, {
        month: 'Jun',
        amount: 11
    }, {
        month: 'Jul',
        amount: 4
    }, {
        month: 'Aug',
        amount: 6
    }, {
        month: 'Sep',
        amount: 11
    }, {
        month: 'Oct',
        amount: 4
    }, {
        month: 'Nov',
        amount: 4
    }, {
        month: 'Dec',
        amount: 4
    }];
}

export function randomBookings(count: number): BookedModel[] {
    return Array(count).fill({}).map((item: RoomModel, index) => {
        return new BookedModel({
            id: index + 1,
            name: random(1, 5) + '0' + random(1, 5),
            checkinDate: faker.date.past(),
            checkoutDate: faker.date.future(),
            prepay: random(0, 100) * 1000,
            note: faker.name.findName(),
        });
    });
}
