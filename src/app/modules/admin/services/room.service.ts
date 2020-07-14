import {Observable, of} from 'rxjs';
import {RoomModel, FloorModel, CustomerModel, BookedModel, BaseService, TransferRoom, ServiceModel} from '../models';
import {environment} from '@environment';
import {randomBooked, randomFloors, randomRoom, randomServices} from '@app/data/admin/room.mock';
import {ActionNavigationType, ActionType} from '../shared/enums';

export class RoomService {
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
