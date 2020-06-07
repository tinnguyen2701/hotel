import {Observable, of} from 'rxjs';
import {random} from 'lodash';
//
import {randomBookings} from '@app/data/admin';
//
import {environment} from '@environment';
import {LoadParamModel, LoadResultModel} from '@app/modules/core/models';
import { RoomModel, FloorModel } from '../models/room.model';
import { randomRooms, randomFloors } from '@app/data/admin/room.mock';
import { BookModel } from '../models';

export class BookingService {

    // getBookingById(param: number): Observable<BookingModel> {
    //     if (environment.production) {
    //         console.log('API: getBookingById');
    //     }
    //     return of(randomBookingById(param));
    // }

    // saveBooking(param: BookingModel): Observable<boolean> {
    //     if (environment.production) {
    //         console.log('API: saveBooking');
    //     }
    //     return of(true);
    // }

    /**
     * Booking
     */
    getBookings(param: LoadParamModel): Observable<LoadResultModel<BookModel[]>> {
        if (environment.production) {
            console.log('API: getBookings');
        }
        return of({
            data: randomBookings(30),
            totalCount: random(50, 100)
        });
    }

    deleteBooking(param: number): Observable<boolean> {
        if (environment.production) {
            console.log('API: deleteBooking');
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
