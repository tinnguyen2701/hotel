import {Component} from '@angular/core';

import {AuthenticationService} from '@app/modules/auth/services';
import {VALIDATION_REGEX} from '@app/shared/constants';
import {LoginModel} from '@app/modules/auth/models';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  userName = '';
  password = '';
  isSubmitting: boolean = false;

  constructor(private authService: AuthenticationService) {
  }

  userNameValidator = (params) => {
    const value = params.value;
    if (VALIDATION_REGEX.email.test(value)) {
      return true;
    }
    if (VALIDATION_REGEX.phone.test(value)) {
      return true;
    }
    return false;
  };

  onLoginClick(args) {
    if (!args.validationGroup.validate().isValid) {
      return;
    }

    const param = new LoginModel({username: this.userName, password: this.password});
    this.isSubmitting = true;
    this.authService.login(param).subscribe((data) => {
      this.isSubmitting = false;
      //
      this.authService.setCurrentUser(data);
      //
      this.authService.redirectToHome('/');
    }, () => {
      this.isSubmitting = false;
    });
  }
}
