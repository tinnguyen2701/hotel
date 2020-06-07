import * as faker from 'faker';
import {random} from 'lodash';
import {BoatModel} from '@app/modules/admin/models/boat.model';

export function randomBoats(count: number): BoatModel[] {
    return Array(count).fill({}).map((item: BoatModel, index) => {
        return new BoatModel({
            id: index + 1,
            boatId: 'B' + faker.random.number(),
            boatName: faker.name.findName(),
            driverId: 'D' + faker.random.number(),
            driverName:  faker.name.findName(),
            driverContactInfo: faker.name.findName(),
            organizerId: 'OR' +  faker.random.number(),
            organizerName: faker.name.findName(),
            ownerId: 'OW' +  faker.random.number(),
            ownerName: faker.name.findName(),
            region: faker.name.findName(),
            departingHarbor1: faker.name.findName(),
            departingHarbor2: faker.name.findName(),
            pricePackageNumber : random(1000, 2000000),
            tripCategory: faker.name.findName(),
            destination: faker.name.findName(),
            note: faker.name.findName()
        });
    });
}

export function randomBoatById(param: number): BoatModel {
    return new BoatModel({
        id: param ,
        boatId: 'B' + faker.random.number(),
        boatName: faker.name.findName(),
        driverId: 'D' + faker.random.number(),
        driverName:  faker.name.findName(),
        driverContactInfo: faker.name.findName(),
        organizerId: 'OR' +  faker.random.number(),
        organizerName: faker.name.findName(),
        ownerId: 'OW' +  faker.random.number(),
        ownerName: faker.name.findName(),
        region: faker.name.findName(),
        departingHarbor1: faker.name.findName(),
        departingHarbor2: faker.name.findName(),
        pricePackageNumber : random(1000, 2000000),
        tripCategory: faker.name.findName(),
        destination: faker.name.findName(),
        note: faker.name.findName()
    });
}

