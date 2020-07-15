import {Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import {Subscription} from 'rxjs';
//
import {PopoverConfirmBoxComponent} from '..';
import {AppLookupService} from '@app/modules/admin/services';
import {BaseService, ServiceModel} from '@app/modules/admin/models';
import {SearchFormDataModel} from '@app/modules/admin/models/search.model';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
    @ViewChild('dxDataGrid', {static: false}) dxDataGrid: DxDataGridComponent;
    @ViewChild('deleteGridRowConfirmPopover', {static: false}) confirmPopover: PopoverConfirmBoxComponent;

    @Input() services: ServiceModel[] = [];

    @Output() onChangeService: EventEmitter<any> = new EventEmitter();

    selectedServiceId: number;
    subscription: Subscription = new Subscription();
    serviceSource: BaseService[] = [];

    constructor(private appLookupService: AppLookupService) {
    }

    ngOnInit() {
        this.subscription.add(
            this.appLookupService.appLookup.subscribe((lookup) => {
                this.serviceSource = lookup.services;
            })
        );
    }

    // customer action
    setPriceColumnValue = (newData: ServiceModel, value: number, currentRowData) => {
        this.setPriceData(newData, value);
    };

    onChangeQuantity = (newData: ServiceModel, value: number, currentRowData) => {
        newData.quantity = value;
        newData.amount = newData.quantity * currentRowData.price;
    };

    private setPriceData(rowData: ServiceModel, value: number) {
        rowData.serviceId = value;
        rowData.price = this.serviceSource.find(_ => _.id === value)?.price || 0;
        rowData.quantity = 1;
        rowData.amount = rowData.quantity * rowData.price;
    }

    onRowUpdated(e: any) {
        e.data.isUpdated = true;
        this.onChangeService.emit();
    }

    onRowInserted(e: any) {
        e.data.isInserted = true;
        this.onChangeService.emit();
    }

    onRowRemoving(e: any) {
        e.data.isDeleted = true;
        this.onChangeService.emit();
    }

    onServiceChanged(cell: any, e: any) {
        if (e && e.value) {
            cell.setValue(e.value);
        }
    }

    onDeleteDxGridRow = (e) => {
        e.event.preventDefault();
        const data = e.row.data;
        if (!Boolean(data.id)) {
            this.dxDataGrid.instance.deleteRow(
                this.dxDataGrid.instance.getRowIndexByKey(data)
            );
        } else {
            this.selectedServiceId = this.services.findIndex((detail) => detail.id === data.id
            );
            if (this.confirmPopover) {
                this.confirmPopover.show(e.event.currentTarget);
            }
        }
    };

    deleteService() {
        if (this.selectedServiceId !== null) {
            this.services.splice(this.selectedServiceId, 1);
            this.dxDataGrid.instance.refresh(true);
            this.selectedServiceId = null;
        }
    }

    customizeTotalValue(e) {
        return (e.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' VND';
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
