import * as faker from 'faker';
import {random} from 'lodash';
import {RoomModel} from '@app/modules/admin/models';



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

