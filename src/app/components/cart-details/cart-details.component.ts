import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookObj } from 'src/assets/bookInterface';
import { DROP_DOWN, LOCATION_ICON } from 'src/assets/svg-icons';
import { LoginSignupComponent } from '../login-signup/login-signup.component';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
})
export class CartDetailsComponent implements OnInit {
  showAddressDetails: boolean = false;
  showOrderSummary: boolean = false;
  cartItems$!: Observable<(BookObj & { quantity: number })[]>;
  count: number = 1;
  cartItems: (BookObj & { quantity: number })[] = [];

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

  toggleAddressDetails() {
    this.showAddressDetails = !this.showAddressDetails;
  }

  toggleOrderSummary() {
    this.showOrderSummary = !this.showOrderSummary;
  }

  ngOnInit(): void {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // Auth token is present, fetch all cart details
      this.bookService
        .getAllCartDetails()
        .pipe(map((response) => response.data))
        .subscribe((cartItems: (BookObj & { quantity: number })[]) => {
          this.dataService.setCartItems(cartItems); // Directly set cart items
        });
    }
    this.cartItems$ = this.dataService.getCartItems();
  }

  increaseCount(book: BookObj) {
    this.bookService
      .updateBookQuantity(book, (book.quantity ?? 0) + 1)
      .subscribe();
    this.dataService.addToCart(book, 1);
  }

  decreaseCount(book: BookObj) {
    if (book && book.quantity !== undefined && book.quantity > 1) {
      this.bookService
        .updateBookQuantity(book, (book.quantity ?? 0) - 1)
        .subscribe();
      this.dataService.addToCart(book, -1);
    }
  }
  removeFromCart(book: BookObj) {
    this.dataService.removeFromCart(book);
    if (book && book.bookId !== undefined) {
      this.bookService.deleteBookFromCart(book.bookId).subscribe(
        () => {},
        (error) => {
          console.error('Error removing book from cart:', error);
        }
      );
    }
  }
  handlePlaceOrder(data: any, choice?: string) {
    if (localStorage.getItem('authToken') != null) {
    } else {
      // Navigate to login/signup page
      this.router.navigate(['/books']).then(() => {
        // Open dialog after navigation
        const dialogRef = this.dialog.open(LoginSignupComponent, {
          data: { value: 'placeOrder', cart: this.cartItems },
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log('The dialog was closed');
        });
      });
    }
  }
}
