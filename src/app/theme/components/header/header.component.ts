import {Component, Input, Output, EventEmitter, OnInit, DoCheck} from '@angular/core';
import {Store} from '@ngxs/store';
import {SelectSnapshot} from '@ngxs-labs/select-snapshot';
//
import {ADMIN_MENU} from '@app/modules/admin/shared/constant';
import {AppState, SetActionType} from '@app/modules/admin/store';
import {BookedModel, RoomModel} from '@app/modules/admin/models';
import { ActionType } from '@app/modules/admin/shared/enums';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
    @SelectSnapshot(AppState.actionType) actionType: ActionType;
    @SelectSnapshot(AppState.bookCheckin) bookCheckin: BookedModel;
    @SelectSnapshot(AppState.bookCheckout) bookCheckout: BookedModel;

    @Input() menuToggleEnabled: boolean = false;
    @Input() showHeaderMenu: boolean = false;

    @Output() menuToggle = new EventEmitter<boolean>();

    menuItems = ADMIN_MENU;

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

    toggleMenu() {
        this.menuToggle.emit();
    }

    showPopUpCheckin() {
        this.store.dispatch(new SetActionType(ActionType.Checkin));
    }

    showPopUpCheckout() {
        this.store.dispatch(new SetActionType(ActionType.Checkout));
    }

    numberRoomCheckin() {
        return this.bookCheckin.rooms.length + ' room' + (this.bookCheckin.rooms.length > 1 ? 's' : '') + ' checkin';
    }

    numberRoomCheckout() {
        return this.bookCheckout.rooms.length + ' room' + (this.bookCheckout.rooms.length > 1 ? 's' : '') + ' checkout';
    }
}
