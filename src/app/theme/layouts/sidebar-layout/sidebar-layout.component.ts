import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';

import {ScreenService} from '@app/modules/core/services';

@Component({
  selector: 'app-layout-sidebar',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss']
})
export class SidebarLayoutComponent implements OnInit, OnDestroy {
    selectedRoute = '';
    menuOpened: boolean;
    temporaryMenuOpened = false;

    menuMode = 'shrink';
    menuRevealMode = 'expand';
    minMenuSize = 0;
    shaderEnabled = false;
    subscription: Subscription = new Subscription();

    constructor(private screen: ScreenService, private router: Router) {
    }

    ngOnInit() {
        this.menuOpened = this.screen.sizes['screen-large'];

        this.subscription.add(this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.selectedRoute = val.urlAfterRedirects.split('?')[0];
            }
        }));
        this.subscription.add(this.screen.changed.subscribe(() => this.updateDrawer()));

        this.updateDrawer();
    }

    updateDrawer() {
        const isXSmall = this.screen.sizes['screen-x-small'];
        const isLarge = this.screen.sizes['screen-large'];

        this.menuMode = isLarge ? 'shrink' : 'overlap';
        this.menuRevealMode = isXSmall ? 'slide' : 'expand';
        this.minMenuSize = isXSmall ? 0 : 60;
        this.shaderEnabled = !isLarge;
    }

    get hideMenuAfterNavigation() {
        return this.menuMode === 'overlap' || this.temporaryMenuOpened;
    }

    get showMenuAfterClick() {
        return !this.menuOpened;
    }

    navigationChanged(event) {
        const link = event.itemData.link;
        const pointerEvent = event.event;

        if (link && this.menuOpened) {
            if (event.node.selected) {
                pointerEvent.preventDefault();
            } else {
                this.router.navigate([link]);
            }

            if (this.hideMenuAfterNavigation) {
                this.temporaryMenuOpened = false;
                this.menuOpened = false;
                pointerEvent.stopPropagation();
            }
        } else {
            pointerEvent.preventDefault();
        }
    }

    navigationClick() {
        if (this.showMenuAfterClick) {
            this.temporaryMenuOpened = true;
            this.menuOpened = true;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
