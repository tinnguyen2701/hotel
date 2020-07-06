import { Observable, of } from 'rxjs';
import { CustomerModel } from '../models';
import { environment } from '@environment';
import { getCustomerWithBookCodeId } from '@app/data/admin';

export class CustomerService {
    getCustomerWithBookCodeId(): Observable<CustomerModel[]> {
        if (environment.production) {
            console.log('API: getRooms');
        }

        return of(getCustomerWithBookCodeId());
    }
}
