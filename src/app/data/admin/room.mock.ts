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
import {ActionNavigationType, BookType, RoomStatus} from '@app/modules/admin/shared/enums';

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
                type: random(1, 2),
                price: random(100, 1000) * 1000,
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

export function randomRoomsBooked(count: number): RoomModel[] {
    return Array(count)
        .fill({})
        .map((item: RoomModel, index) => {
            const floor = random(1, 7).toString();

            return new RoomModel({
                id: parseInt(floor + '0' + (index + 1).toString(), 10),
                name: floor + '0' + (index + 1).toString(),
                type: random(1, 2),
                price: random(100, 1000) * 1000,
            });
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
            name: 'breakfast',
            price: 20000,
        },
        {
            id: 2,
            name: 'lunch',
            price: 70000,
        },
        {
            id: 3,
            name: 'dinner',
            price: 100000,
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

export function randomBookings(count: number, listRooms: RoomModel[] = null): BookedModel[] {
    return Array(count).fill({}).map((item: RoomModel, index) => {
        let bookType: number;
        if (listRooms && listRooms.length > 0) {
            bookType = listRooms.length === 1 ? 1 : 2;
        } else {
            bookType = random(1, 2);
        }

        if (bookType === BookType.Personal) {
            return new BookedModel({
                id: index + 1,
                code: ['A', 'B', 'C', 'D'][random(0, 3)] + random(1, 99),
                bookType,
                status: random(1, 3),
                name: ['mr A', 'mr B', 'mr C', 'mr D', 'mr E'][random(0, 4)],
                checkinDate: faker.date.past(),
                checkoutDate: faker.date.future(),
                prepay: random(0, 50) * 1000,
                note: faker.lorem.sentence(),
                deduct: 0,
                roomType: random(1, 2),
                paymentAmount: random(5, 100) * 1000,
                checkoutStatus: random(1, 4)
            });
        } else {
            return new BookedModel({
                id: index + 1,
                code: ['A', 'B', 'C', 'D'][random(0, 3)] + random(1, 99),
                bookType,
                status: random(1, 3),
                name: ['Cty A', 'Cty B', 'Cty C', 'Cty D', 'Cty E'][random(0, 4)],
                checkinDate: faker.date.past(),
                checkoutDate: faker.date.future(),
                prepay: random(0, 50) * 1000,
                note: faker.lorem.sentence(),
                rooms: randomRoomsBooked(random(2, 5)),
                peopleNumber: random(5, 10),
                deduct: 0,
                paymentAmount: random(5, 100) * 1000,
                checkoutStatus: random(1, 4)
            });
        }
    });
}
