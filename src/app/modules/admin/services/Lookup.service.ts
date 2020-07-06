import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { cloneDeep, join } from "lodash";
import { ApiService } from "@app/modules/core/services";
import { AppLookupModel } from "../models";
import { environment } from "@environment";
import { randomServiceLookup } from "@app/data/admin";
import { AppLookupDataType } from "../shared/enums";

export const API_ENDPOINT = {
    AppLookup: `api/`,
};

@Injectable()
export class AppLookupService {
    private _appLookup: BehaviorSubject<AppLookupModel> = new BehaviorSubject(
        new AppLookupModel()
    );
    private _onLookupChange: EventEmitter<AppLookupModel> = new EventEmitter<AppLookupModel>();


    constructor(private baseService: ApiService) {}

    get appLookup(): Observable<AppLookupModel> {
        return this._appLookup.asObservable();
    }

    private get lookups(): AppLookupModel {
        return this._appLookup.getValue();
    }

    getAppLookup(
        lookupNames?: AppLookupDataType[]
    ): Observable<AppLookupModel> {
        if (environment.debug) {
            console.log("API: getAppLookup");

            // TODO: API to load all the lookups bellow from database

            const services = randomServiceLookup();
            return of(
                new AppLookupModel({
                    services,
                })
            );
        }

        let params = "";
        if (lookupNames && lookupNames.length) {
            params = `?keys=${join(lookupNames, ",")}`;
        }

        return this.baseService.get(`${API_ENDPOINT.AppLookup}${params}`);
    }

    reloadLookup(lookupName: AppLookupDataType) {
        this.getAppLookup([lookupName]).subscribe((data: AppLookupModel) => {
            const currentLookup = cloneDeep(this.lookups);

            switch (lookupName) {
                case AppLookupDataType.Services:
                    currentLookup.terms = data.services;
                    break;
                default:
                    break;
            }
            this.setAppLookup(currentLookup);
        });
    }

    setAppLookup(value: AppLookupModel) {
        this._appLookup.next(value);
        this._onLookupChange.emit(value);
    }
}
