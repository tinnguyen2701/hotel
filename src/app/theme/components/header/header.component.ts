import {Component, Input, Output, EventEmitter, OnInit, DoCheck} from '@angular/core';
import { Store } from '@ngxs/store';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
//
import {ADMIN_MENU} from '@app/modules/admin/shared/constant';
import { AppState, AppStateModel, SetIsShowListRoom } from '@app/modules/admin/store';
import { RoomModel } from '@app/modules/admin/models';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
    // @SelectSnapshot(AppState.listRoom) listRoom: RoomModel[];
	@SelectSnapshot(AppState.listRoom) listRoom: RoomModel[];
	@SelectSnapshot(AppState.isShowListRoom) isShowListRoom: boolean;

    @Input() menuToggleEnabled: boolean = false;
    @Input() showHeaderMenu: boolean = false;

    @Output() menuToggle = new EventEmitter<boolean>();

    menuItems = ADMIN_MENU;
    class = 'bg-info';

    constructor(private store: Store) {
    }

    ngOnInit() {
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

    showPopUp = () => {
        this.store.dispatch(new SetIsShowListRoom());
    }
}
