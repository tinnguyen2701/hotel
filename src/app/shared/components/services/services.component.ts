import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverConfirmBoxComponent } from '..';
import { DxDataGridComponent } from 'devextreme-angular';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
    @ViewChild('dxDataGrid', {static: false}) dxExpenseAccountGrid: DxDataGridComponent;
    @ViewChild('deleteGridRowConfirmPopover', {static: false}) confirmPopover: PopoverConfirmBoxComponent;

    selectedRowId: number;

    constructor() {}

    onDxGridRowUpdated(e: any) {
        e.data.isUpdated = true;
    }

    onDxGridRowInserted(e: any) {
        e.data.isInserted = true;
    }


    onAddExpenseAccount() {
        this.dxExpenseAccountGrid.instance.addRow();
        this.autoFocusAddingRow();
    }

    autoFocusAddingRow(rowIndex = 0, cellIndex = 1, isFocusRow = false) {
        const editCell = this.dxExpenseAccountGrid.instance.getCellElement(rowIndex, cellIndex);
        this.dxExpenseAccountGrid.instance.focus(editCell);
        if (isFocusRow) {
            this.dxExpenseAccountGrid.instance.editRow(rowIndex);
        }
        this.dxExpenseAccountGrid.instance.editCell(rowIndex, cellIndex);
    }

    onDeleteDxGridRow = (e) => {
        e.event.preventDefault();
        const data = e.row.data;
        this.selectedRowId = data.id;
        if (this.confirmPopover) {
            this.confirmPopover.show(e.event.currentTarget);
        }
    }

    onDeleteExpenseAccount() {
        // this.expenseAccounts = this.expenseAccounts.filter(account => account.id !== this.selectedRowId);
        // this.onRemovedRow.emit(this.selectedRowId);
    }
}
