import {Component, OnInit} from '@angular/core';
import { BookingService } from '../../services';
import { FloorModel } from '../../models/room.model';
import { RoomStatus } from '../../shared/enums';
import { ROOM_STATUS_TYPE } from '../../shared/constant';


@Component({
  selector: 'app-all-rooms',
  templateUrl: 'all-rooms.component.html',
  styleUrls: ['./all-rooms.component.scss']
})

export class AllRoomsComponent implements OnInit {
  floors: FloorModel[] = [];
  roomStatus = RoomStatus;
  roomStatusType = ROOM_STATUS_TYPE;
  selectedStatus = RoomStatus.All;
  now: Date = new Date();
  constructor(private bookingsService: BookingService) {
  }



  ngOnInit() {
      this.loadFloor();
    }

  loadFloor() {
      this.bookingsService.getFloors().subscribe(result => {
        this.floors = result;
        console.log(this.floors);

      }, err => {

      });
  }


}
