import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {AuthenticationService} from '@app/modules/auth/services';
import {UserModel} from '@app/modules/core/models';


@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent implements OnInit, OnDestroy {
  menuItems = [
    {
      text: 'Profile',
      icon: 'user'
    },
    {
      text: 'Logout',
      icon: 'runner',
      onClick: () => {
        this.authService.logout();
      }
    }
  ];

  currentUser: UserModel = new UserModel();
  subscription: Subscription = new Subscription();

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.subscription.add(this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
