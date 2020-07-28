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
    selectedRooms: RoomModel[] = [];
    bookType = BookType;
    roomTypes: { value: number, name: string }[] = [
        {value: RoomType.Single, name: 'Single Room'},
        {value: RoomType.Double, name: 'Double Room'}
    ];

    paymentMethods = PAYMENT_METHOD_TYPE;
    paymentRoomAmount: number = 0;
    paymentServiceAmount: number = 0;

    constructor(private bookingsService: BookingService) {
    }

    ngOnInit() {
        this.bookingsService.getBooking(this.listRoomSelected).subscribe(rs => {
            this.selectedBooking = rs;
            console.log(this.selectedBooking);
            if (this.listRoomSelected && this.listRoomSelected.length === 1) {
                this.paymentCalculatorPersonal();
            }
        });

        this.selectedBooking.paymentMethod = PaymentMethodTypes.Cash;
    }

    onSelectionChanged() {
        this.selectedRooms = this.dxDataGrid.instance.getSelectedRowsData();
        this.paymentCalculatorGroup();
    }

    onContentGridReady() {
        this.dxDataGrid.instance.selectAll();
        this.paymentCalculatorGroup();
    }

    paymentCalculatorGroup() {
        this.paymentRoomAmount = 0;
        this.paymentServiceAmount = 0;

        if (this.selectedRooms && this.selectedRooms.length > 0) {
            this.selectedRooms.forEach(_ => this.paymentRoomAmount += _.price);
        }
        this.selectedBooking.services.forEach(_ => this.paymentServiceAmount += _.quantity * _.price);
    }

    paymentCalculatorPersonal() {
        this.paymentRoomAmount = this.selectedBooking.roomPrice;
        this.paymentServiceAmount = 0;
        this.selectedBooking.services.forEach(_ => this.paymentServiceAmount += _.quantity * _.price);
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
