import * as faker from 'faker';
import {random} from 'lodash';
import {BookModel} from '@app/modules/admin/models';

export function randomBookings(count: number): BookModel[] {
    return Array(count).fill({}).map((item: BookModel, index) => {
        return new BookModel({
            id: index + 1,
            roomName: random(1, 5) + '0' + random(1, 5),
            contactName: faker.name.findName(),
            checkinDate: faker.date.past(),
            checkoutDate: faker.date.future(),
            roomType: random(1, 2),
            prepay: random(0, 100) * 1000,
            note: faker.name.findName(),
            createdDate: faker.date.past(),
            author: faker.name.findName(),
            code: faker.name.findName(),
        });
    });
}

// export function randomBookingById(param: number): BookModel {
//     const arrActivities = [BookingActivity.Transportation, BookingActivity.ScubaDiving, BookingActivity.Overnight];
//     return new BookModel({
//         id: param,
//         bookingID: faker.random.number(),
//         dateBooking: faker.date.future(),
//         region: faker.name.findName(),
//         departingHarbor: faker.name.findName(),
//         departingDate: faker.date.future(),
//         pickupTime: faker.date.future(),
//         userID: faker.random.number(),
//         userName: faker.name.findName(),
//         driverID: faker.random.number(),
//         driverName: faker.name.findName(),
//         boatID: faker.random.number(),
//         boatName: faker.name.findName(),
//         price: faker.random.number(),
//         discountApplied: faker.random.number(),
//         income: faker.random.number(),
//         activities: arrActivities
//     });
// }

