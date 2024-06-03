import { Component, OnInit } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DROP_DOWN, LOCATION_ICON } from 'src/assets/svg-icons';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookObj } from 'src/assets/bookInterface';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookService } from 'src/app/services/bookservice/book.service';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/httpservice/http.service';
import { log } from 'console';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
})
export class CartDetailsComponent implements OnInit {
  customerForm!: FormGroup;
  showAddNewAddress: boolean = false;
  editaddress: boolean = true;
  showIcons: boolean = false;
  editadd: any = {};
  addressList: any[] = [];
  orderaddress: any;
  addressForm!: FormGroup;
  placeorder: boolean = true;
  order: boolean = true;
  typeDisplayMap: { [key: string]: string } = {
    '1': 'Home',
    '2': 'Work',
    '3': 'Other',
  };
  emptyAddress: any = {
    addressId: null,
    name: '',
    mobileNumber: '',
    address: '',
    city: '',
    state: '',
    type: '',
  };
  showAddressDetails: boolean = false;
  showOrderSummary: boolean = false;
  showOrderPlaced: boolean = false;
  cartItems: (BookObj & { quantity: number })[] = [];
  bookIds!: any[];
  authToken: string | null = null;
  count: number = 1;
  address: any[] = [];
  selectedAddressId: number | null = null;
  private orderSummarySubscription!: Subscription;

  constructor(
    private dataService: DataService,
    private bookService: BookService,
    private httpService: HttpService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    iconRegistry.addSvgIconLiteral(
      'location-icon',
      sanitizer.bypassSecurityTrustHtml(LOCATION_ICON)
    );
    iconRegistry.addSvgIconLiteral(
      'drop-down-icon',
      sanitizer.bypassSecurityTrustHtml(DROP_DOWN)
    );
  }

  onOrderAddressChanged(address: any) {
    this.orderaddress = address;
  }
  ngOnInit(): void {
    this.dataService.currCartList.subscribe((response) => {
      this.cartItems = response;
    });
    this.updateCartBookIds();
    //////////////
    this.loadAddresses();
    this.addressForm = this.fb.group({
      name: [this.emptyAddress.name, Validators.required],
      mobileNumber: [
        this.emptyAddress.mobileNumber,
        [Validators.required, Validators.pattern('[0-9]{10}')],
      ],
      address: [this.emptyAddress.address, Validators.required],
      city: [this.emptyAddress.city, Validators.required],
      state: [this.emptyAddress.state, Validators.required],
      type: [this.emptyAddress.type, Validators.required],
    });
  }
  toggleOrderSummary() {
    this.showOrderSummary = !this.showOrderSummary;
  }
  removeFromCart(book: BookObj) {
    this.cartItems = this.cartItems.filter(
      (item) => item.bookId !== book.bookId
    );
    this.dataService.removeFromCart(book);
    if (
      book &&
      book.bookId !== undefined &&
      localStorage.getItem('authToken')
    ) {
      this.bookService.deleteBookFromCart(book.bookId).subscribe(
        () => {},
        (error) => {
          console.error('Error removing book from cart:', error);
        }
      );
    }
  }

  increaseCount(book: BookObj) {
    if (book && book.quantity !== undefined) {
      if (localStorage.getItem('authToken') != null) {
        this.bookService.updateBookQuantity(book, ++book.quantity).subscribe(
          () => {},
          (error) => {
            console.error('Error updating quantity:', error);
          }
        );
      } else {
        this.dataService.addToCart(book, 1);
      }
    }
  }

  decreaseCount(book: BookObj) {
    if (book && book.quantity !== undefined && book.quantity > 1) {
      if (localStorage.getItem('authToken') != null) {
        this.bookService.updateBookQuantity(book, --book.quantity).subscribe(
          () => {},
          (error) => {
            console.error('Error updating quantity:', error);
          }
        );
      } else {
        this.dataService.addToCart(book, -1);
      }
    }
  }

  handlePlaceOrder() {
    if (localStorage.getItem('authToken') != null) {
      this.placeorder = false;
    } else {
      const dialogRef = this.dialog.open(LoginSignupComponent, {
        data: { value: 'placeOrder', cart: this.cartItems },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  }

  updateCartBookIds(): void {
    this.bookIds = this.cartItems.map((item) => item.bookId);
  }
  handleCheckout() {
    this.httpService
      .addOrder(this.bookIds)
      .subscribe((err) => console.log(err));
    this.router.navigate(['/orders']);
  }
  loadAddresses() {
    this.dataService.currAddressList.subscribe((res: any) => {
      this.addressList = res;
    });
  }

  removeAddress(addressId: number) {
    this.httpService.removeAddress(addressId).subscribe((res) => {
      this.loadAddresses();
    });
  }
  editAddress(address: any) {
    this.showAddNewAddress = true;
    this.showIcons = true;
    this.editaddress = false;
    this.editadd = address;
    this.addressForm.patchValue({
      addressId: address.addressId,
      name: address.name,
      mobileNumber: address.mobileNumber,
      address: address.address,
      city: address.city,
      state: address.state,
      type: address.type,
      userId: address.userId,
    });
  }
  handleaddress() {
    if (this.addressForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    this.showAddNewAddress = false;
    this.showIcons = false;

    const userData = this.addressForm.value;
    if (this.editadd && this.editadd.addressId) {
      userData.addressId = this.editadd.addressId;
      this.httpService.updataAddress(userData).subscribe(
        (res: any) => {
          console.log(res);
          this.loadAddresses();
        },
        (err: any) => console.log(err)
      );
    } else {
      console.log(userData);

      this.httpService.addAddress(userData).subscribe(
        (res) => {
          console.log(res);
          this.loadAddresses();
        },
        (err) => console.log(err)
      );
    }
    this.editaddress = true;
  }
  handleContinue(data: any) {
    this.order = false;
    this.dataService.toggleOrderSummary();
    this.showIcons = true;
    this.showAddNewAddress = true;
    this.orderaddress = data;
  }
}
