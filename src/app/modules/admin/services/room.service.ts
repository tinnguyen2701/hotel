import { Observable, of } from 'rxjs';
import {RoomModel, FloorModel, CustomerModel, BookedModel} from '../models';
import { environment } from '@environment';
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

    updateRoom(rooms: RoomModel[], customers: CustomerModel[], status: number, totalPeople: number): Observable<string> {
        if (environment.debug) {
            console.log('API: updateRoom');
        }

        return of('B-100');
    }

    addListRoom(rooms: RoomModel[], status: ActionType): Observable<RoomModel[]> {
        if (environment.debug) {
            console.log('API: addListRoom');
        }

        return of(rooms);
    }

    getListRoom(rooms: RoomModel[], status: ActionType): Observable<{listRoomCheckin: RoomModel[], listRoomCheckout: RoomModel[]}> {
        if (environment.debug) {
            console.log('API: getListRoom');
        }

        return of({listRoomCheckin: [randomRoom(102, 1)], listRoomCheckout: []});
    }
}
