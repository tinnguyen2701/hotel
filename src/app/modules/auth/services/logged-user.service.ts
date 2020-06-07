import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {UserModel} from '@app/modules/core/models';

@Injectable()
export class LoggedUserService {
  private _currentUser: BehaviorSubject<UserModel> = new BehaviorSubject(null);

  constructor() {
  }

  get currentUser(): Observable<UserModel> {
    return this._currentUser.asObservable();
  }

  setLoggedUser(user: UserModel) {
    this._currentUser.next(user);
  }

  get loggedUserId(): number {
    const user = this._currentUser.getValue();
    return user ? user.id : null;
  }

  get loggedUser(): UserModel {
    return this._currentUser.getValue();
  }
}
