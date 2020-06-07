import * as faker from 'faker';
import {random} from 'lodash';
import {BookingModel} from '@app/modules/admin/models';
import {BookingActivity} from '@app/modules/admin/shared/enums';

export function randomBookings(count: number): BookingModel[] {
    const arrActivities = [BookingActivity.Snorkeling, BookingActivity.IslandHopping];
    const arrActivitiesOvernight = [BookingActivity.Transportation, BookingActivity.ScubaDiving, BookingActivity.Overnight];
    return Array(count).fill({}).map((item: BookingModel, index) => {
        return new BookingModel({
            id: index + 1,
            bookingID: faker.random.number(),
            dateBooking: faker.date.future(),
            region: faker.name.findName(),
            departingHarbor: faker.name.findName(),
            departingDate: faker.date.future(),
            pickupTime: faker.date.future(),
            userID: faker.random.number(),
            userName: faker.name.findName(),
            driverID: faker.random.number(),
            driverName: faker.name.findName(),
            boatID: faker.random.number(),
            boatName: faker.name.findName(),
            price: random(1000, 10000000),
            status: random(1, 4),
            discountApplied: faker.random.number(),
            income: faker.random.number(),
            activities: index % 2 ? arrActivities : arrActivitiesOvernight,
            overnightN: random(1, 7),
            overnightD: random(1, 7)
        });
    });
}

export function randomBookingById(param: number): BookingModel {
    const arrActivities = [BookingActivity.Transportation, BookingActivity.ScubaDiving, BookingActivity.Overnight];
    return new BookingModel({
        id: param,
        bookingID: faker.random.number(),
        dateBooking: faker.date.future(),
        region: faker.name.findName(),
        departingHarbor: faker.name.findName(),
        departingDate: faker.date.future(),
        pickupTime: faker.date.future(),
        userID: faker.random.number(),
        userName: faker.name.findName(),
        driverID: faker.random.number(),
        driverName: faker.name.findName(),
        boatID: faker.random.number(),
        boatName: faker.name.findName(),
        price: faker.random.number(),
        discountApplied: faker.random.number(),
        income: faker.random.number(),
        activities: arrActivities
    });
}

