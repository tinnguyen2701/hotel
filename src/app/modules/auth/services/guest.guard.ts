import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

import {AuthenticationService} from '@app/modules/auth/services/authentication.service';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate() {
    if (!this.authService.isLoggedIn()) {
      return true;
    } else {
      this.authService.redirectToHome();
      return false;
    }
  }
}
