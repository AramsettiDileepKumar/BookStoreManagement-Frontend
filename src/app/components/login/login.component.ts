import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { log } from 'console';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { HttpService } from 'src/app/services/httpservice/http.service';
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
  wishlist: any;
  tempWishlist: any;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private bookService: BookService,
    private dataService: DataService,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: { value: string; cart: any }
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    console.log('Injected data:', this.data);
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
        console.log('hello');

        if (this.data && this.data.value === 'placeOrder') {
          console.log('Login');
          this.templist = this.data.cart;
          console.log(this.templist);
          this.bookService.getAllCartDetails(res.data).subscribe(
            (response) => {
              console.log(response);

              this.cartList = response.data;
              console.log(this.cartList);
              this.updateCart(this.templist, this.cartList, res.data);
              // window.location.reload();
              console.log('updated successfully.');
            },
            (err) => console.log(err)
          );
          this.bookService.getAllBooksWishlist(res.data).subscribe(
            (response) => {
              this.wishlist = response.data;
              this.dataService.currWishlist.subscribe((list) => {
                this.tempWishlist = list;
              });
              this.updateWishlist(this.tempWishlist, this.wishlist, res.data);
            },
            (err) => console.log(err)
          );
          this.httpService
            .getOrderList(res.data)
            .subscribe((res) => this.dataService.updateOrderList(res));
        }
        this.bookService.getAddress(res.data).subscribe((result) => {
          this.dataService.updateAddressList(result.data);
        });
        this.bookService
          .getAllCartDetails(res.data)
          .subscribe((result) => this.dataService.setAllCartItems(result.data));
        this.bookService
          .getAllBooksWishlist(res.data)
          .subscribe((result) => this.dataService.updateWishlist(result.data));
        this.dialogRef.afterClosed().subscribe((result) => {});
      },
      (err) => console.log(err)
    );
  }
  updateCart(localList: any, backendData: any, token: string) {
    for (const DataFromLocal of localList) {
      const newList = backendData.find(
        (res: any) => res.bookId === DataFromLocal.bookId
      );
      if (newList) {
        newList.quantity += DataFromLocal.quantity;
        this.bookService
          .updateBookQuantity(newList.bookId, newList.quantity, token)
          .subscribe((res) => console.log(res));
      } else {
        backendData.push(DataFromLocal);
        this.bookService
          .addBookToCart(DataFromLocal.bookId, DataFromLocal.quantity, token)
          .subscribe((res) => console.log(res));
      }
    }

    return backendData;
  }
  updateWishlist(localList: any, backendData: any, token: string) {
    for (const localData of localList) {
      const newList = backendData.find(
        (res: any) => res.bookId === localData.bookId
      );
      if (!newList) {
        backendData.push(localData);
        this.bookService
          .addAllToWishlist(localData, token)
          .subscribe((res) => console.log(res));
      }
    }
  }
}
