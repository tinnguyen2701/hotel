import { Component, OnInit, ViewChild } from '@angular/core';
import { AppNotify } from '@app/utilities';
import { BookModel, FilterBookModel } from '../../models';
import DataSource from 'devextreme/data/data_source';
import { BookingService } from '../../services';
import { LoadParamModel } from '@app/modules/core/models';
import { ROOM_TYPE } from '../../shared/constant';
import { PopoverConfirmBoxComponent } from '@app/shared/components';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
    @ViewChild('deleteDetailConfirmPopover') deleteDetailConfirmPopover: PopoverConfirmBoxComponent;
    //
    dataSource: DataSource;
    filterBooking: FilterBookModel = new FilterBookModel();
    dataBooking: BookModel = new BookModel();
    roomType = ROOM_TYPE;
    selectedId: number;
    isOpenBookingDetailPopup: boolean = false;
    isProcessing: boolean = false;
    codeBook: string;
    nameRoom: string;

    constructor(private bookingsService: BookingService) {
    }

    ngOnInit() {
        this.loadBookings();
    }

    loadBookings() {
        this.dataSource = new DataSource({
            load: (loadOptions) => {
                const loadParams = new LoadParamModel(loadOptions, this.filterBooking);
                return this.bookingsService.getBookings(loadParams).toPromise();
            }
        });
    }

    onSearchBooking() {
        this.filterBooking.codeBook = this.codeBook;
        this.filterBooking.nameRoom = this.nameRoom;
        this.loadBookings();
    }

    onBookingDetail(param: BookModel) {
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
            this.loadBookings();
            this.isProcessing = false;
        }, (error) => {
            AppNotify.error();
            this.isProcessing = false;
        });
    }
}
