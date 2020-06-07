import {Injectable} from '@angular/core';
import {
  Router, CanActivate, CanActivateChild, CanLoad,
  ActivatedRouteSnapshot, RouterStateSnapshot, Route
} from '@angular/router';

import {AuthenticationService} from '@app/modules/auth/services/authentication.service';
import {ApiService} from '@app/modules/core/services/api.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private authService: AuthenticationService, private apiService: ApiService) {
  }

  private isLoggedIn(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    //
    this.authService.removeCurrentUser(false);
    this.apiService.navigateToLogin(true);
    //
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isLoggedIn();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isLoggedIn();
  }

  canLoad(route: Route): boolean {
    return this.isLoggedIn();
  }
}
