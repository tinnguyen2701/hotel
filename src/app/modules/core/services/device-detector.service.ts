import {PLATFORM_ID, Inject, Injectable} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import * as Constants from '../../../utilities/device-detector';
import {ReTree} from '@app/utilities';

export interface DeviceInfo {
    userAgent: string;
    os: string;
    browser: string;
    device: string;
    os_version: string;
    browser_version: string;
}

@Injectable()
export class DeviceDetectorService {
    ua = '';
    userAgent = '';
    os = '';
    browser = '';
    device = '';
    os_version = '';
    browser_version = '';

    constructor(@Inject(PLATFORM_ID) private platformId) {
        if (isPlatformBrowser(this.platformId)) {
            this.ua = window.navigator.userAgent;
        }
        this._setDeviceInfo();
    }

    /**
     * @desc Sets the initial value of the device when the service is initiated.
     * This value is later accessible for usage
     */
    private _setDeviceInfo() {
        let reTree = new ReTree();
        let ua = this.ua;
        this.userAgent = ua;
        let mappings = [
            {const: 'OS', prop: 'os'},
            {const: 'BROWSERS', prop: 'browser'},
            {const: 'DEVICES', prop: 'device'},
            {const: 'OS_VERSIONS', prop: 'os_version'},
        ];

        mappings.forEach((mapping) => {
            this[mapping.prop] = Object.keys(Constants[mapping.const]).reduce((obj: any, item: any) => {
                obj[Constants[mapping.const][item]] = reTree.test(ua, Constants[`${mapping.const}_RE`][item]);
                return obj;
            }, {});
        });

        mappings.forEach((mapping) => {
            this[mapping.prop] = Object.keys(Constants[mapping.const])
                .map((key) => {
                    return Constants[mapping.const][key];
                }).reduce((previousValue, currentValue) => {
                    return (previousValue === Constants[mapping.const].UNKNOWN && this[mapping.prop][currentValue])
                        ? currentValue : previousValue;
                }, Constants[mapping.const].UNKNOWN);
        });

        this.browser_version = '0';
        if (this.browser !== Constants.BROWSERS.UNKNOWN) {
            let re = Constants.BROWSER_VERSIONS_RE[this.browser];
            let res = reTree.exec(ua, re);
            if (!!res) {
                this.browser_version = res[1];
            }
        }
    }

    /**
     * @desc Returns the device information
     * @returns the device information object.
     */
    public getDeviceInfo(): DeviceInfo {
        const deviceInfo: DeviceInfo = {
            userAgent: this.userAgent,
            os: this.os,
            browser: this.browser,
            device: this.device,
            os_version: this.os_version,
            browser_version: this.browser_version
        };
        return deviceInfo;
    }

    /**
     * @desc Compares the current device info with the mobile devices to check
     * if the current device is a mobile and also check current device is tablet so it will return false.
     * @returns whether the current device is a mobile
     */
    public isMobile(): boolean {
        if (this.isTablet()) {
            return false;
        }
        const mobiles = Constants.MOBILES;
        let isMob = false;
        for (const key in mobiles) {
            if (mobiles.hasOwnProperty(key)) {
                const pattern = new RegExp(mobiles[key]);
                if (pattern.test(this.userAgent)) {
                    isMob = true;
                    break;
                }
            }
        }
        return isMob;
    }

    /**
     * @desc Compares the current device info with the tablet devices to check
     * if the current device is a tablet.
     * @returns whether the current device is a tablet
     */
    public isTablet() {
        const tablets = Constants.TABLETS;
        let isTab = false;
        for (const key in tablets) {
            if (tablets.hasOwnProperty(key)) {
                const pattern = new RegExp(tablets[key]);
                if (pattern.test(this.userAgent)) {
                    isTab = true;
                    break;
                }
            }
        }
        return isTab;
    }

    /**
     * @desc Compares the current device info with the desktop devices to check
     * if the current device is a desktop device.
     * @returns whether the current device is a desktop device
     */
    public isDesktop() {
        const desktopDevices = [
            Constants.DEVICES.PS4,
            Constants.DEVICES.CHROME_BOOK,
            Constants.DEVICES.UNKNOWN
        ];
        if (this.device === Constants.DEVICES.UNKNOWN) {
            if (this.isMobile() || this.isTablet()) {
                return false;
            }
        }
        return desktopDevices.indexOf(this.device) > -1;
    }
}
