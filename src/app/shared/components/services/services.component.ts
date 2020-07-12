import {Component, OnInit, ViewChild, OnDestroy, Input} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import {Subscription} from 'rxjs';
//
import {PopoverConfirmBoxComponent} from '..';
import {AppLookupService} from '@app/modules/admin/services';
import {BaseLookup, ServiceModel} from '@app/modules/admin/models';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
    @ViewChild('dxDataGrid', {static: false}) dxDataGrid: DxDataGridComponent;
    @ViewChild('deleteGridRowConfirmPopover', {static: false}) confirmPopover: PopoverConfirmBoxComponent;

    @Input() services: ServiceModel[] = [];

    selectedServiceId: number;
    subscription: Subscription = new Subscription();
    serviceSource: BaseLookup[] = [];

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
    onRowUpdated(e: any) {
        e.data.isUpdated = true;
    }

    onRowInserted(e: any) {
        e.data.isInserted = true;
    }

    onRowRemoving(e: any) {
        e.data.isDeleted = true;
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
