import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/modules/auth/services';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  logout(e) {
    e.stopPropagation();
    e.preventDefault();
    this.authenticationService.logout();
  }
}
