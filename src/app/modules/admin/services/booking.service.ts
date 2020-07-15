import {Observable, of} from 'rxjs';
import {random} from 'lodash';
//
import {randomBooked, randomBookings, randomRoom, randomServices} from '@app/data/admin';
import {environment} from '@environment';
import {RoomModel, FloorModel, BookedModel, TransferRoom, ServiceModel} from '../models/room.model';
import { randomRooms, randomFloors } from '@app/data/admin/room.mock';
import { BookModel } from '../models';
import { LoadParamModel, LoadResultModel } from '@app/modules/core/models';
import {ActionNavigationType, ActionType} from '@app/modules/admin/shared/enums';

export class BookingService {
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

    getFloors(): Observable<FloorModel[]> {
        if (environment.debug) {
            console.log('API: getRooms');
        }

        return of(randomFloors(7));
    }

    getBookRoom(roomId: number, status: ActionNavigationType): Observable<BookedModel> {
        if (environment.debug) {
            console.log('API: getBookRoom');
        }

        return of(randomBooked(roomId, status));
    }

    updateBook(book: BookedModel): Observable<string> {
        if (environment.debug) {
            console.log('API: updateRoom');
        }

        return of('B-100');
    }

    addBook(book: BookedModel, status: ActionType): Observable<BookedModel> {
        if (environment.debug) {
            console.log('API: addBook');
        }

        return of(book);
    }

    transferRoom(transferRoom: TransferRoom): Observable<boolean> {
        if (environment.debug) {
            console.log('API: transferRoom');
        }

        return of(true);
    }

    getBookCheckinAndCheckout(): Observable<{ bookAvailable: BookedModel, bookCheckin: BookedModel, bookCheckout: BookedModel }> {
        if (environment.debug) {
            console.log('API: getBookCheckinAndCheckout');
        }

        return of({
            bookAvailable: new BookedModel({rooms: [randomRoom(102, 1)]})
            , bookCheckin: new BookedModel()
            , bookCheckout: new BookedModel()
        });
    }

    checkoutBook(booked: BookedModel): Observable<boolean> {
        if (environment.debug) {
            console.log('API: checkoutBook');
        }

        return of(true);
    }

    saveBookEditing(booked: BookedModel): Observable<boolean> {
        if (environment.debug) {
            console.log('API: saveBookEditing');
        }

        return of(true);
    }

    saveService(service: ServiceModel): Observable<boolean> {
        if (environment.debug) {
            console.log('API: saveService');
        }

        return of(true);
    }

    deleteService(serviceId: number): Observable<boolean> {
        if (environment.debug) {
            console.log('API: deleteService');
        }

        return of(true);
    }

    getServices(): Observable<ServiceModel[]> {
        if (environment.debug) {
            console.log('API: getServices');
        }

        return of(randomServices(3));
    }

    removeCheckinBook(book: BookedModel): Observable<boolean> {
        if (environment.debug) {
            console.log('API: removeCheckinBook');
        }

        return of(true);
    }
}
