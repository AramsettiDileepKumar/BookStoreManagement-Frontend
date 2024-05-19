import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookObj } from 'src/assets/bookInterface';

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

  constructor(
    private dataService: DataService,
    private bookService: BookService
  ) {}

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
  }

  increaseCount(book: BookObj) {
    this.dataService.addToCart(book, 1);
  }

  decreaseCount(book: BookObj) {
    if (book && book.quantity !== undefined && book.quantity > 1) {
      this.dataService.addToCart(book, -1);
    }
  }
}
