import {Component, EventEmitter, Input, Output} from '@angular/core';
import {cloneDeep} from 'lodash';

import {SearchFormDataModel} from '@app/modules/admin/models/search.model';

@Component({
    selector: 'app-search-form',
    templateUrl: 'search-form.component.html',
    styleUrls: ['search-form.component.scss']
})
export class SearchFormComponent {
    private _request: SearchFormDataModel = new SearchFormDataModel();

    //
    @Input()
    get request(): SearchFormDataModel {
        return this._request;
    }

    set request(value: SearchFormDataModel) {
        this._request = value;
        this.requestChange.emit(value);
    }

    @Output() requestChange: EventEmitter<SearchFormDataModel> = new EventEmitter();
    @Output() onFilterAction: EventEmitter<SearchFormDataModel> = new EventEmitter();

    filterBooking: SearchFormDataModel = new SearchFormDataModel();

    constructor() {
    }

    onSearch() {
        this.request = cloneDeep(this.filterBooking);
        this.onFilterAction.emit(this.filterBooking);
    }
}
