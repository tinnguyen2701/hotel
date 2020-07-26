import { Component, OnInit, ViewChild } from '@angular/core';
import { AppNotify } from '@app/utilities';
import { PopoverConfirmBoxComponent } from '@app/shared/components';
import DataSource from 'devextreme/data/data_source';
import { FilterBookModel, RoomModel } from '../../models';
import { LoadParamModel } from '@app/modules/core/models';
import { BookingService } from '../../services';
import { ROOM_TYPE } from '../../shared/constant';
import {DxDataGridComponent} from 'devextreme-angular';

@Component({
  selector: 'app-admin-booked',
  templateUrl: './booked.component.html',
  styleUrls: ['./booked.component.scss']
})
export class BookedClientsComponent implements OnInit {
    @ViewChild('deleteDetailConfirmPopover') deleteDetailConfirmPopover: PopoverConfirmBoxComponent;
    @ViewChild('dxDataGrid') dxDataGrid: DxDataGridComponent;
    //
    dataSource: DataSource;
    filterBooking: FilterBookModel = new FilterBookModel();
    dataBooking: RoomModel = new RoomModel();
    roomType = ROOM_TYPE;
    selectedId: number;
    isProcessing: boolean = false;
    codeBook: string;
    nameRoom: string;

    constructor(private bookingsService: BookingService) {
        this.loadBookings();
    }

    ngOnInit() {
    }

    loadBookings() {
        // this.dataSource = new DataSource({
        //     load: (loadOptions) => {
        //         const loadParams = new LoadParamModel(loadOptions, this.filterBooking);
        //         return this.bookingsService.getBookings(loadParams).toPromise();
        //     }
        // });
    }

    onSearchBooking() {
        this.filterBooking.codeBook = this.codeBook;
        this.filterBooking.nameRoom = this.nameRoom;
        this.dxDataGrid.instance.refresh();
    }

    onBookingDetail(param: RoomModel) {
        this.dataBooking = param;
    }

    onDeleteBooking(id: number, e) {
        this.selectedId = id;
        if (this.deleteDetailConfirmPopover) {
            this.deleteDetailConfirmPopover.show(e.currentTarget);
        }
    }

    deleteBooking() {
        this.isProcessing = true;
        this.bookingsService.deleteBooking(this.selectedId).subscribe(() => {
            AppNotify.success('Deleted success');
            this.dxDataGrid.instance.refresh();
            this.isProcessing = false;
        }, (error) => {
            AppNotify.error();
            this.isProcessing = false;
        });
    }
}
