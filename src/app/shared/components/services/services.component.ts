import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverConfirmBoxComponent } from '..';
import { DxDataGridComponent } from 'devextreme-angular';
import { CustomerModel } from '@app/modules/admin/models';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
    @ViewChild('dxDataGridCustomer', {static: true}) dxDataGridCustomer: DxDataGridComponent;
    @ViewChild('deleteDetailConfirmPopover', {static: true}) confirmDeleteDetailPopover: PopoverConfirmBoxComponent;

    isLoading: boolean = false;
    isProcessing: boolean = false;
    selectedRoomId: number = null;
    isFormDirty: boolean = false;
    customers: CustomerModel[] = [];
    gender = [
        {value: 0, text: 'Female'},
        {value: 1, text: 'Male'},
    ];

    constructor(
    ) {
    }

    ngOnInit() {
    }

    onSaveSkill = (e) => {
        this.customers.reverse();
        e.event.preventDefault();
        e.component.saveEditData();
        this.customers.reverse();
    };

    onRevertDxGridRow = (e) => {
        e.event.preventDefault();
        e.component.cancelEditData();
        e.component.refresh();
    };

    updateLookupData = (e) => {
        e.component.editRow(e.row.dataIndex);
    };

    onDeleteSkill = (e) => {
        e.event.preventDefault();
        const data = e.row.data;
        if (!Boolean(data.id)) {
            this.dxDataGridCustomer.instance.deleteRow(
                this.dxDataGridCustomer.instance.getRowIndexByKey(data)
            );
        } else {
            this.selectedRoomId = this.customers.findIndex((detail) => detail.id === data.id
            );
            if (this.confirmDeleteDetailPopover) {
                this.confirmDeleteDetailPopover.show(e.event.currentTarget);
            }
        }
    };

    deleteRoom() {
        if (this.selectedRoomId !== null) {
            this.customers.splice(this.selectedRoomId, 1);
            this.dxDataGridCustomer.instance.refresh(true);
            this.selectedRoomId = null;
        }
    }
}
