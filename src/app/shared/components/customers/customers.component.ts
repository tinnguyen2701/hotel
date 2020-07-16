import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import {cloneDeep} from 'lodash';
//
import {PopoverConfirmBoxComponent} from '..';
import {CustomerModel} from '@app/modules/admin/models';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
    private _customers: CustomerModel[];
    @ViewChild('dxDataGrid', {static: true}) dxDataGrid: DxDataGridComponent;
    @ViewChild('confirmPopover', {static: true}) confirmPopover: PopoverConfirmBoxComponent;

    @Input()
    get customers(): CustomerModel[] {
        return this._customers;
    }

    set customers(value: CustomerModel[]) {
        this._customers = value;
        this.customersChange.emit(value);
    }

    @Output() customersChange = new EventEmitter<CustomerModel[]>();

    editingCustomers: CustomerModel[] = [];
    selectedRowIndex: number;
    selectedRowData: CustomerModel = new CustomerModel();

    constructor() {
    }

    ngOnInit() {
        this.cloneSource();
    }

    cloneSource() {
        this.editingCustomers = cloneDeep(this.customers);
    }


    onRowInserted(e: any) {
        const data: CustomerModel = e.data;
        data.isInserted = true;
        this.customers.push(data);
    }

    onRowUpdated(e: any) {
        if (e.data.id) {
            e.data.isUpdated = true;
        }

        this.customers = this.customers.map((_: any) => {
            if (_.__KEY__ && _.__KEY__ === e.data.__KEY__ || _.id && _.id === e.data.id) {
                _ = e.data;
            }
            return _;
        });

    }

    onSaveDxGridRow = () => {
        this.dxDataGrid.instance.saveEditData();
    };

    onUpdateDxGridRow = (e) => {
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
        this.selectedRowIndex = this.editingCustomers.findIndex(detail => detail.id === data.id);

        if (!data.id) {
            this.selectedRowData = data;
            this.removedServiceWithoutId();
        } else {
            this.selectedRowData = this.editingCustomers.find(detail => detail.id === data.id);
            if (this.confirmPopover) {
                this.confirmPopover.show(e.event.currentTarget);
            }
        }
    };

    removedServiceWithoutId() {
        const index = this.customers.findIndex(_ => _.id === this.editingCustomers[this.selectedRowIndex].id);
        this.dxDataGrid.instance.deleteRow(this.selectedRowIndex);
        this.customers.splice(index, 1);
    }

    deleteCustomer() {
        this.customers = this.customers.map(_ => {
            if (_.id === this.selectedRowData.id) {
                _.isDeleted = true;
            }
            return _;
        });
        this.editingCustomers.splice(this.selectedRowIndex, 1);
    }
}
