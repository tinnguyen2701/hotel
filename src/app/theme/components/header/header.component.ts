import {Component, Input, Output, EventEmitter} from '@angular/core';
import { Store } from '@ngxs/store';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
//
import {ADMIN_MENU} from '@app/modules/admin/shared/constant';
import { AppState, AppStateModel } from '@app/modules/admin/store';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
    @SelectSnapshot(AppState.isShowListRoom) appLookup: AppStateModel;
    @SelectSnapshot(AppState.)

    @Input() menuToggleEnabled: boolean = false;
    @Input() showHeaderMenu: boolean = false;

    @Output() menuToggle = new EventEmitter<boolean>();

    menuItems = ADMIN_MENU;

    constructor(private store: Store) {
    }

    onSubmenuShowing(e) {
        if (e) {
            const menuPopup = e.submenu.$contentDelimiter[0].parentNode;
            if (menuPopup) {
                menuPopup.classList.add('header-submenu');
            }
        }
    }

    toggleMenu = () => {
        this.menuToggle.emit();
    }
}
