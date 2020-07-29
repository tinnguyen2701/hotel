import {Component, OnInit, ViewChild} from '@angular/core';
import {AppNotify} from '@app/utilities';
import {PopoverConfirmBoxComponent} from '@app/shared/components';
import DataSource from 'devextreme/data/data_source';
import {BookedModel, FilterBookModel, RoomModel} from '../../models';
import {LoadParamModel} from '@app/modules/core/models';
import {BookingService} from '../../services';
import {PAYMENT_STATUS_TYPE, ROOM_TYPE} from '../../shared/constant';
import {DxDataGridComponent} from 'devextreme-angular';
import {BookType} from '@app/modules/admin/shared/enums';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-admin-booked',
    templateUrl: './booked-list.component.html',
    styleUrls: ['./booked-list.component.scss']
})
export class BookedClientsComponent implements OnInit {
    // @ViewChild('deleteDetailConfirmPopover') deleteDetailConfirmPopover: PopoverConfirmBoxComponent;
    // @ViewChild('dxDataGrid') dxDataGrid: DxDataGridComponent;
    // //
    // dataSource: DataSource;
    // filterBooking: FilterBookModel = new FilterBookModel();
    // dataBooking: RoomModel = new RoomModel();
    // roomType = ROOM_TYPE;
    // selectedId: number;
    // isProcessing: boolean = false;
    // codeBook: string;
    // nameRoom: string;
    //
    // constructor(private bookingsService: BookingService) {
    //     this.loadBookings();
    // }
    //
    // ngOnInit() {
    // }
    //
    // loadBookings() {
    //     // this.dataSource = new DataSource({
    //     //     load: (loadOptions) => {
    //     //         const loadParams = new LoadParamModel(loadOptions, this.filterBooking);
    //     //         return this.bookingsService.getBookings(loadParams).toPromise();
    //     //     }
    //     // });
    // }
    //
    // onSearchBooking() {
    //     this.filterBooking.codeBook = this.codeBook;
    //     this.filterBooking.nameRoom = this.nameRoom;
    //     this.dxDataGrid.instance.refresh();
    // }
    //
    // onBookingDetail(param: RoomModel) {
    //     this.dataBooking = param;
    // }
    //
    // onDeleteBooking(id: number, e) {
    //     this.selectedId = id;
    //     if (this.deleteDetailConfirmPopover) {
    //         this.deleteDetailConfirmPopover.show(e.currentTarget);
    //     }
    // }
    //
    // deleteBooking() {
    //     this.isProcessing = true;
    //     this.bookingsService.deleteBooking(this.selectedId).subscribe(() => {
    //         AppNotify.success('Deleted success');
    //         this.dxDataGrid.instance.refresh();
    //         this.isProcessing = false;
    //     }, (error) => {
    //         AppNotify.error();
    //         this.isProcessing = false;
    //     });
    // }
    @ViewChild('paymentGrid', {static: true}) paymentGrid: DxDataGridComponent;
    @ViewChild('deletingConfirmBox', {static: true}) deletingConfirmBox: PopoverConfirmBoxComponent;
    //
    bookingSource: DataSource;
    filterBooking: FilterBookModel = new FilterBookModel();
    roomType = ROOM_TYPE;
    paymentStatus = PAYMENT_STATUS_TYPE;
    selectedBooking: BookedModel;
    isLoading: boolean = false;
    isProcessing: boolean = false;

    constructor(private bookingsService: BookingService) {
        this.loadBookings();
    }

    ngOnInit() {
        this.loadBookings();
    }

    onChangedKeySearch() {
        this.bookingSource.reload();
    }

    loadBookings() {
        this.isLoading = true;
        this.bookingSource = new DataSource({
            load: (loadOptions) => {
                const loadParams = new LoadParamModel(loadOptions, this.filterBooking);
                this.isLoading = false;
                return this.bookingsService.getListBookings(loadParams).toPromise();
            }
        });
    }

    onGridCellPrepared(e) {
        if (e.rowType === 'data' && e.column.command === 'expand') {
            const rowData: BookedModel = e.row.data;
            if (rowData.bookType === BookType.Personal) {
                e.cellElement.classList.remove('dx-datagrid-expand');
                e.cellElement.firstElementChild.classList.remove('dx-datagrid-group-closed');
            }
        }
    }

    openDeletingConfirmPopup(data: BookedModel, e: any) {
        this.selectedBooking = data;
        if (this.deletingConfirmBox) {
            this.deletingConfirmBox.show(e.currentTarget);
        }
    }

    onDeleteBooking() {
        if (!this.selectedBooking) {
            return false;
        }
        this.isProcessing = true;
        this.bookingsService.deleteBooking(this.selectedBooking.id).pipe(finalize(() => {
            this.isProcessing = false;
            this.bookingSource.reload();
        })).subscribe(() => {
            AppNotify.success('Deleted success');
        });
    }
}
