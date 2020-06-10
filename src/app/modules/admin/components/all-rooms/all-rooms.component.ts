import {Component, OnInit} from '@angular/core';
import { BookingService } from '../../services';
import { FloorModel, RoomModel } from '../../models/room.model';
import { RoomStatus } from '../../shared/enums';
import { ROOM_STATUS_TYPE } from '../../shared/constant';

export enum ActionType {
	StateTransitions,
	Edit,
	Delete,
	Cancel,
	Plan,
	Processing,
	Accomplished
}

@Component({
  selector: 'app-admin-all-rooms',
  templateUrl: 'all-rooms.component.html',
  styleUrls: ['./all-rooms.component.scss']
})

export class AllRoomsComponent implements OnInit {
  floors: FloorModel[] = [];
  roomStatus = RoomStatus;
  roomStatusType = ROOM_STATUS_TYPE;
  selectedStatus = RoomStatus.All;
  checkinDate: Date = null;
  checkoutDate: Date = null;
  selectedRoom: RoomModel = new RoomModel();
  defaultVisible: boolean;
	menus = [
    {
      value: ActionType.Edit,
      name: 'Edit',
      icon: 'fas fa-pencil-alt'
    },
    {
      value: ActionType.Delete,
      name: this.translator.instant(marker('HRM..Delete')),
      icon: 'far fa-trash-alt'
    },
    {
      value: ActionType.StateTransitions,
      name: this.translator.instant(marker('HRM..StateTransitions')),
      icon: 'far fa-clone'
    },
  ];
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

  onClickRoom(room: RoomModel) {
    this.selectedRoom = room;
  }

  toggleDefault() {
    this.defaultVisible = !this.defaultVisible;
  }

}
