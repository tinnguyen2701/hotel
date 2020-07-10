import {Observable, of} from 'rxjs';
import {RoomModel, FloorModel, CustomerModel, BookedModel, BaseLookup} from '../models';
import {environment} from '@environment';
import {randomBooked, randomFloors, randomRoom} from '@app/data/admin/room.mock';
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

    updateBook(book: BookedModel, status: number, totalPeople: number): Observable<string> {
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

    transferRoom(fromRoom: BaseLookup, toRoom: BaseLookup): Observable<true> {
        if (environment.debug) {
            console.log('API: transferRoom');
        }

        return of(true);
    }

    getBookCheckinAndCheckout(): Observable<{ bookCheckin: BookedModel, bookCheckout: BookedModel }> {
        if (environment.debug) {
            console.log('API: getBookCheckinAndCheckout');
        }

        return of({bookCheckin: new BookedModel({rooms: [randomRoom(102, 1)]}), bookCheckout: new BookedModel()});
    }
}
