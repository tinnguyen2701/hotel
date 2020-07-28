import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
//
import {BookedModel, RoomModel} from '@app/modules/admin/models';
import {BookingService} from '@app/modules/admin/services';
import {BookType, PaymentMethodTypes, RoomType} from '@app/modules/admin/shared/enums';
import {AppNotify} from '@app/utilities';
import {PAYMENT_METHOD_TYPE} from '@app/modules/admin/shared/constant';

@Component({
    selector: 'app-admin-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    private _visible: boolean = false;
    //
    @ViewChild('dxDataGrid', {static: false}) dxDataGrid: DxDataGridComponent;
    //
    @Input() listRoomSelected: RoomModel[] = [];

    @Input()
    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
        this.visibleChange.emit(value);
    }

    //
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onCheckoutBooking = new EventEmitter<void>();

    //
    selectedBooking: BookedModel = new BookedModel();
    selectedRooms: BookedModel[] = [];
    bookType = BookType;
    roomTypes: { value: number, name: string }[] = [
        {value: RoomType.Single, name: 'Single Room'},
        {value: RoomType.Double, name: 'Double Room'}
    ];

    paymentMethods = PAYMENT_METHOD_TYPE;

    constructor(private bookingsService: BookingService) {
    }

    ngOnInit() {
        this.bookingsService.getBooking(this.listRoomSelected).subscribe(rs => {
            this.selectedBooking = rs;
            console.log(this.selectedBooking);
        });
        this.selectedBooking.paymentMethod = PaymentMethodTypes.Cash;
    }

    onSelectionChanged() {
        this.selectedRooms = this.dxDataGrid.instance.getSelectedRowsData();
    }

    onContentGridReady() {
        this.dxDataGrid.instance.selectAll();
    }

    onHandleCancel() {
        this.visible = false;
    }

    onHandleCheckout() {
        this.bookingsService.checkout(this.selectedBooking)
            .subscribe(rs => {
                    this.onCheckoutBooking.emit();
                    this.visible = false;
                }, (error) => {
                    AppNotify.error('Update error!');
                }
            );
    }
}
