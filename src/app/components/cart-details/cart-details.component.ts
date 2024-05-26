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

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
})
export class CartDetailsComponent implements OnInit {
  showAddressDetails: boolean = false;
  showOrderSummary: boolean = false;
  showOrderPlaced: boolean = false;
  cartItems: (BookObj & { quantity: number })[] = [];
  authToken: string | null = null;
  count: number = 1;
  placeOrder: boolean = false;
  address: any[] = [];
  selectedAddressId: number | null = null;
  private orderSummarySubscription!: Subscription;

  constructor(
    private dataService: DataService,
    private bookService: BookService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog
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

  ngOnInit(): void {
    this.dataService.currCartList.subscribe((response) => {
      this.cartItems = response;
    });
    this.orderSummarySubscription =
      this.dataService.orderSummaryToggled.subscribe(() => {
        this.toggleOrderSummary();
      });
  }
  toggleAddressDetails() {
    this.showAddressDetails = !this.showAddressDetails;
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
      this.showAddressDetails = !this.showAddressDetails;
      this.placeOrder = !this.placeOrder;
    } else {
      this.router.navigate(['/books']).then(() => {
        const dialogRef = this.dialog.open(LoginSignupComponent, {
          data: { value: 'placeOrder', cart: this.cartItems },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed');
        });
      });
    }
  }
  handleCheckout() {
    this.router.navigate(['/orders']);
  }
}
