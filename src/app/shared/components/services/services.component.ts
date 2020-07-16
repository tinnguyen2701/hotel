import {Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import {Subscription} from 'rxjs';
import {cloneDeep} from 'lodash';
//
import {PopoverConfirmBoxComponent} from '..';
import {AppLookupService} from '@app/modules/admin/services';
import {BaseService, ServiceModel} from '@app/modules/admin/models';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
    private _services: ServiceModel[];
    @ViewChild('dxDataGrid', {static: false}) dxDataGrid: DxDataGridComponent;
    @ViewChild('deleteGridRowConfirmPopover', {static: false}) confirmPopover: PopoverConfirmBoxComponent;

    @Input()
    get services(): ServiceModel[] {
        return this._services;
    }

    set services(value: ServiceModel[]) {
        this._services = value;
        this.servicesChange.emit(value);
    }

    @Output() servicesChange = new EventEmitter<ServiceModel[]>();
    @Output() onChangeService: EventEmitter<any> = new EventEmitter();

    subscription: Subscription = new Subscription();
    serviceSource: BaseService[] = [];
    editingServices: ServiceModel[] = [];
    selectedRowIndex: number;
    selectedRowData: ServiceModel = new ServiceModel();

    constructor(private appLookupService: AppLookupService) {
    }

    ngOnInit() {
        this.subscription.add(
            this.appLookupService.appLookup.subscribe((lookup) => {
                this.serviceSource = lookup.services;
            })
        );
        this.cloneSource();
    }

    cloneSource() {
        this.editingServices = cloneDeep(this.services);
    }

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
        if (e.data.id) {
            e.data.isUpdated = true;
        }

        this.services = this.services.map((_: any) => {
            if (_.__KEY__ && _.__KEY__ === e.data.__KEY__ || _.id && _.id === e.data.id) {
                _ = e.data;
            }
            return _;
        });

    }

    onRowInserted(e: any) {
        const data: ServiceModel = e.data;
        data.isInserted = true;
        this.services.push(data);
    }

    onServiceChanged(cell: any, e: any) {
        if (e && e.value) {
            cell.setValue(e.value);
        }
    }

    deleteService() {
        this.services = this.services.map(_ => {
            if (_.id === this.selectedRowData.id) {
                _.isDeleted = true;
            }
            return _;
        });
        this.editingServices.splice(this.selectedRowIndex, 1);
    }

    customizeTotalValue(e) {
        return (e.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' VND';
    }

    onSaveDxGridRow = () => {
        this.dxDataGrid.instance.saveEditData();
    };

    updateLookupData = (e) => {
        this.dxDataGrid.instance.editRow(e.row.dataIndex);
        this.dxDataGrid.instance.repaint();
    };

    onRevertDxGridRow = (e) => {
        e.event.preventDefault();
        e.component.cancelEditData();
        e.component.refresh();
    };

    onDeleteDxGridRow = (e) => {
        e.event.preventDefault();
        const data = e.row.data;
        this.selectedRowIndex = this.editingServices.findIndex(detail => detail.id === data.id);

        if (!data.id) {
            this.selectedRowData = data;
            this.removedServiceWithoutId();
        } else {
            this.selectedRowData = this.editingServices.find(detail => detail.id === data.id);
            if (this.confirmPopover) {
                this.confirmPopover.show(e.event.currentTarget);
            }
        }
    };

    removedServiceWithoutId() {
        const index = this.services.findIndex(_ => _.id === this.editingServices[this.selectedRowIndex].id);
        this.dxDataGrid.instance.deleteRow(this.selectedRowIndex);
        this.services.splice(index, 1);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
