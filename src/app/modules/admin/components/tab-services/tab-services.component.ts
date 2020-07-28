import {Component, Input, OnInit} from '@angular/core';
//
import {ServiceModel} from '@app/modules/admin/models';
import {BookingService} from '@app/modules/admin/services';

@Component({
    selector: 'app-admin-tab-services',
    templateUrl: './tab-services.component.html',
    styleUrls: ['./tab-services.component.scss']
})
export class TabServicesComponent implements OnInit {
    @Input() services: ServiceModel[] = [];
    @Input() readOnly: boolean = false;
    //
    constructor(private bookingsService: BookingService) {
    }

    ngOnInit() {
        if (this.services && !this.services.length) {
            this.bookingsService.getListServices().subscribe(rs => {
                this.services = rs;
            });
        }
    }
}
