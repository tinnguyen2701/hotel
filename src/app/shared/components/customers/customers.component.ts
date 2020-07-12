import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
//
import {PopoverConfirmBoxComponent} from '..';
import {CustomerModel} from '@app/modules/admin/models';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
    @ViewChild('dxDataGridCustomer', {static: true}) dxDataGridCustomer: DxDataGridComponent;
    @ViewChild('deleteDetailConfirmPopover', {static: true}) confirmDeleteDetailPopover: PopoverConfirmBoxComponent;

    @Input() customers: CustomerModel[] = [];

    selectedCustomerId: number = null;

    constructor() {
    }

    ngOnInit() {
    }

    // customer action
    onRowUpdated(e: any) {
        e.data.isUpdated = true;
    }

    onRowInserted(e: any) {
        e.data.isInserted = true;
    }

    onRowRemoving(e: any) {
        e.data.isDeleted = true;
    }

    onRevertDxGridRow = (e) => {
        e.event.preventDefault();
        e.component.cancelEditData();
        e.component.refresh();
    };

    onDeleteCustomer = (e) => {
        e.event.preventDefault();
        const data = e.row.data;
        if (!Boolean(data.id)) {
            this.dxDataGridCustomer.instance.deleteRow(
                this.dxDataGridCustomer.instance.getRowIndexByKey(data)
            );
        } else {
            this.selectedCustomerId = this.customers.findIndex((detail) => detail.id === data.id
            );
            if (this.confirmDeleteDetailPopover) {
                this.confirmDeleteDetailPopover.show(e.event.currentTarget);
            }
        }
    };

    deleteCustomer() {
        if (this.selectedCustomerId !== null) {
            this.customers.splice(this.selectedCustomerId, 1);
            this.dxDataGridCustomer.instance.refresh(true);
            this.selectedCustomerId = null;
        }
    }
}
