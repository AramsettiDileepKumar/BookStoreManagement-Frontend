import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  templist: any;
  cartList: any;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private bookService: BookService,
    @Inject(MAT_DIALOG_DATA) public data: { value: string; cart: any }
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
        if (this.data.value == 'placeOrder') {
          this.templist = this.data.cart;
          this.bookService.getAllCartDetails(res.data).subscribe(
            (response) => {
              this.cartList = response.data;
              this.updateCart(this.templist, this.cartList);
              window.location.reload();
            },
            (err) => console.log(err)
          );
        }

        this.router.navigate(['/books']);
      },
      (err) => console.log(err)
    );
  }
  updateCart(a: any, b: any) {
    for (const itemA of a) {
      const itemB = b.find((item: any) => item.bookId === itemA.bookId);
      if (itemB) {
        itemB.quantity += itemA.quantity;
        this.bookService
          .updateBookQuantity(itemB.bookId, itemB.quantity)
          .subscribe((res) => console.log(res));
      } else {
        b.push(itemA);
        this.bookService
          .addBookToCart(itemA.bookId, itemA.quantity)
          .subscribe((res) => console.log(res));
      }
    }
    return b;
  }
}
