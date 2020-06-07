import * as faker from 'faker';
import {
    CategoryModel,
    OtherMessengerModel,
    PartnerModel
} from '@app/modules/admin/models/partner.model';
import {random} from 'lodash';

export function randomPartners(param: number): PartnerModel[] {
    return Array(54).fill({}).map((item: PartnerModel, index) => {
        return new PartnerModel({
            id: index + 1,
            userID: 'P' + faker.random.number(),
            firstName: faker.name.findName(),
            middleName:  faker.name.findName(),
            lastName:  faker.name.findName(),
            phoneNumber: faker.random.number(),
            whatsapp: faker.random.number(),
            role: faker.name.findName(),
            region: faker.name.findName(),
            harbor: 'XXXX',
            preferredWayOfContact: faker.name.findName()
        });
    });
}

export function randomPartnerById(param: number): PartnerModel {
    return new PartnerModel({
        id: param ,
        userID: 'P' + faker.random.number(),
        firstName: faker.name.findName(),
        middleName:  faker.name.findName(),
        lastName:  faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber('0165#######'),
        whatsapp: faker.random.number(),
        role: faker.name.findName(),
        region: faker.name.findName(),
        harbor: 'XXXX',
        preferredWayOfContact: faker.name.findName(),
        organization: faker.name.findName(),
        category: random(1, 5),
        otherMessengerType: random(1, 5),
        otherMessengerName: faker.name.findName()
    });
}

export function randomOtherMessengers(): OtherMessengerModel[] {
    return Array(54).fill({}).map((item: OtherMessengerModel, index) => {
        return new OtherMessengerModel({
            id: index + 1,
            value: faker.name.findName()
        });
    });
}

export function randomCategorys(): CategoryModel[] {
    return Array(54).fill({}).map((item: OtherMessengerModel, index) => {
        return new OtherMessengerModel({
            id: index + 1,
            value: faker.name.findName()
        });
    });
}
