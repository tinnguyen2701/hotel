import {Observable, of} from 'rxjs';

import {environment} from '@environment';
import {randomPartnerById} from '@app/data/admin/partner.mock';
import {PartnerModel} from '@app/modules/admin/models/partner.model';
import {LoadParamModel, LoadResultModel} from '@app/modules/core/models';
import {random} from 'lodash';
import {randomBoats} from '@app/data/admin/boat.mock';
import {BoatModel} from '@app/modules/admin/models/boat.model';

export class BoatService {

    getBoats(param: LoadParamModel): Observable<LoadResultModel<BoatModel[]>> {
        if (environment.production) {
            console.log('API: getBoats');
        }
        return of({
            data: randomBoats(30),
            totalCount: random(50, 100)
        });
    }
    getBoatById(param: number): Observable<PartnerModel> {
        if (environment.production) {
            console.log('API: getBoatById');
        }
        return of(randomPartnerById(param));
    }

    saveBoat(param: PartnerModel): Observable<boolean> {
        if (environment.production) {
            console.log('API: saveBoat');
        }
        return of(true);
    }

    deleteBoat(param: number): Observable<boolean> {
        if (environment.production) {
            console.log('API: deleteBoat');
        }
        return of(true);
    }
}
