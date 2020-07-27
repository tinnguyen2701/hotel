import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {cloneDeep} from 'lodash';

//
import {BaseService, ServiceModel} from '@app/modules/admin/models';
import {AppLookupService} from '@app/modules/admin/services';
import {DxDataGridComponent} from 'devextreme-angular';
import {PopoverConfirmBoxComponent} from '@app/shared/components';

@Component({
    selector: 'app-tab-services',
    templateUrl: './tab-services.component.html',
    styleUrls: ['./tab-services.component.scss']
})
export class TabServicesComponent implements OnInit, OnDestroy {
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
    @Output() onChangeService: EventEmitter<void> = new EventEmitter();

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

    onRowInserted(e: any) {
        const data: ServiceModel = e.data;
        data.isInserted = true;
        this.services.push(data);
        this.onChangeService.emit();
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
        this.onChangeService.emit();
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
        this.onChangeService.emit();
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
