import { Observable, of } from 'rxjs';
import { RoomModel, FloorModel, CustomerModel } from '../models';
import { environment } from '@environment';
import { randomFloors, randomRoom } from '@app/data/admin/room.mock';

export class RoomService {
    getFloors(): Observable<FloorModel[]> {
        if (environment.production) {
            console.log('API: getRooms');
        }

        return of(randomFloors(7));
    }

    getRoom(roomId: number): Observable<RoomModel> {
        if (environment.production) {
            console.log('API: getRoom');
        }

        return of(randomRoom(roomId, 1));
    }

    updateRoom(rooms: RoomModel[], customers: CustomerModel[], status: number, totalPeople: number): Observable<boolean> {
        if (environment.production) {
            console.log('API: updateRoom');
        }

        return of(true);
    }
}
