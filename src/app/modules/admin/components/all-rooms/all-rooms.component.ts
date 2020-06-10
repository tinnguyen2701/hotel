import {Component, OnInit} from '@angular/core';
import { BookingService } from '../../services';
import { FloorModel, RoomModel } from '../../models/room.model';
import { RoomStatus } from '../../shared/enums';
import { ROOM_STATUS_TYPE } from '../../shared/constant';



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
	menus = [];

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

  this.menus = [
    {
      value: TrainingActionType.EditTraining,
      name: this.translator.instant(marker('HRM.TRAINING.EditTraining')),
      icon: 'fas fa-pencil-alt'
    },
    {
      value: TrainingActionType.DeleteTraining,
      name: this.translator.instant(marker('HRM.TRAINING.DeleteTraining')),
      icon: 'far fa-trash-alt'
    },
    {
      value: TrainingActionType.StateTransitions,
      name: this.translator.instant(marker('HRM.TRAINING.StateTransitions')),
      icon: 'far fa-clone'
    },
  ];
}
