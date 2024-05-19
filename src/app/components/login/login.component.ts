import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/bookservice/book.service';
import { UserService } from 'src/app/services/userservice/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  get loginControls() {
    return this.loginForm.controls;
  }
  handleLogin() {
    console.log(this.loginForm.controls);
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.userService.loginApiCall(email, password).subscribe(
      (res) => {
        localStorage.setItem('authToken', res.data);
       
        this.router.navigate(['/books']);
      },
      (err) => console.log(err)
    );
  }
}
