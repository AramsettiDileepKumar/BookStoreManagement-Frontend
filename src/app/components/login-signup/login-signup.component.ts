import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  login = true;
  goToLogin() {
    this.login = true;
  }
  goToSignUp() {
    this.login = false;
  }
}
