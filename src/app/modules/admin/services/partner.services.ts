import {Observable, of} from 'rxjs';

import {environment} from '@environment';
import {randomCategorys, randomOtherMessengers, randomPartnerById, randomPartners} from '@app/data/admin/partner.mock';
import {OtherMessengerModel, PartnerModel} from '@app/modules/admin/models/partner.model';
import {LoadParamModel, LoadResultModel} from '@app/modules/core/models';
import {random} from 'lodash';

export class PartnerService {

    getPartners(param: LoadParamModel): Observable<LoadResultModel<PartnerModel[]>> {
        if (environment.production) {
            console.log('API: getPartners');
        }
        return of({
            data: randomPartners(30),
            totalCount: random(50, 100)
        });
    }
    getPartnerById(param: number): Observable<PartnerModel> {
        if (environment.production) {
            console.log('API: getPartnerById');
        }
        return of(randomPartnerById(param));
    }

    savePartner(param: PartnerModel): Observable<boolean> {
        if (environment.production) {
            console.log('API: savePartner');
        }
        return of(true);
    }

    deletePartner(param: number): Observable<boolean> {
        if (environment.production) {
            console.log('API: deletePartner');
        }
        return of(true);
    }

    getOtherMessengers(): Observable<OtherMessengerModel[]> {
        if (environment.production) {
            console.log('API: getPartner');
        }
        return of(randomOtherMessengers());
    }

    getCategorys(): Observable<OtherMessengerModel[]> {
        if (environment.production) {
            console.log('API: getCategorys');
        }
        return of(randomCategorys());
    }
}
