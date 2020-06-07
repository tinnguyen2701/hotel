import {Observable, of} from 'rxjs';
import {random} from 'lodash';
//
import {randomBookingById, randomBookings} from '@app/data/admin';
//
import {environment} from '@environment';
import {BookingModel, FilterBookingModel} from '@app/modules/admin/models';
import {LoadParamModel, LoadResultModel} from '@app/modules/core/models';
import { RoomModel, FloorModel } from '../models/room.model';
import { randomRooms, randomFloors } from '@app/data/admin/room.mock';

export class BookingService {

    getBookings(param: LoadParamModel): Observable<LoadResultModel<BookingModel[]>> {
        if (environment.production) {
            console.log('API: getBookings');
        }
        return of({
            data: randomBookings(30),
            totalCount: random(50, 100)
        });
    }

    getBookingById(param: number): Observable<BookingModel> {
        if (environment.production) {
            console.log('API: getBookingById');
        }
        return of(randomBookingById(param));
    }

    saveBooking(param: BookingModel): Observable<boolean> {
        if (environment.production) {
            console.log('API: saveBooking');
        }
        return of(true);
    }

    deleteBooking(param: number): Observable<boolean> {
        if (environment.production) {
            console.log('API: deleteSalesOrders');
        }
        return of(true);
    }

    /**
     * Rooms
     */

    getFloors(): Observable<FloorModel[]> {
        if (environment.production) {
            console.log('API: getRooms');
        }

        return of(randomFloors(5));
    }
}
