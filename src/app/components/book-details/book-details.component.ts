import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookObj } from 'src/assets/bookInterface';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent implements OnInit {
  selectedBook!: BookObj;
  addedToBag: boolean = false;
  count: number = 1;
  addedToWishlist: boolean = false;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.dataService.currentBookList.subscribe((res1) => {
      this.route.params.subscribe((res2) => {
        this.selectedBook = res1.filter((e) => e.bookId == res2['bookId'])[0];
        this.checkIfBookInWishlist();
        const cartItem = this.dataService.currCartList.subscribe(
          (cartItems) => {
            const item = cartItems.find(
              (item) => item.bookId === this.selectedBook.bookId
            );
            if (item) {
              this.addedToBag = true;
              this.count = item.quantity;
            }
          }
        );
      });
    });
    if (localStorage.getItem('authToken')) {
      this.dataService.currCartList.subscribe((res: any) => {
        const result = res;
        for (let i = 0; i < result.length; i++) {
          if (result[i].bookId === this.selectedBook.bookId) {
            this.addedToBag = true;
            this.count = result[i].quantity;
          }
        }
      });
    }
  }
  checkIfBookInWishlist() {
    if (localStorage.getItem('authToken')) {
      this.dataService.currWishlist.subscribe((wishlistBooks) => {
        const bookInWishlist = wishlistBooks.some(
          (book: any) => book.bookId === this.selectedBook.bookId
        );
        if (bookInWishlist) {
          this.addedToWishlist = true;
        }
      });
    } else {
      this.dataService.currWishlist.subscribe((wishlist) => {
        const bookInWishlist = wishlist.some(
          (book) => book.bookId === this.selectedBook.bookId
        );
        if (bookInWishlist) {
          this.addedToWishlist = true;
        }
      });
    }
  }

  addToBag() {
    this.addedToBag = true;
    this.dataService.addToCart(this.selectedBook, this.count);
    if (localStorage.getItem('authToken') != null) {
      this.bookService
        .addBookToCart(this.selectedBook, this.count)
        .subscribe(() => {
          console.log('Book added to cart successfully');
        });
    }
  }

  increaseCount() {
    this.count++;
    if (this.addedToBag) {
      this.dataService.addToCart(this.selectedBook, 1);
      if (localStorage.getItem('authToken')) {
        this.bookService
          .updateBookQuantity(this.selectedBook, this.count)
          .subscribe(() => {
            console.log('Book quantity updated successfully');
          });
      }
    }
  }

  decreaseCount() {
    if (this.count > 1) {
      this.count--;
      if (this.addedToBag) {
        this.dataService.addToCart(this.selectedBook, -1);
        if (localStorage.getItem('authToken')) {
          this.bookService
            .updateBookQuantity(this.selectedBook, this.count)
            .subscribe(() => {
              console.log('Book quantity updated successfully');
            });
        }
      }
    }
  }
  addToWishlist() {
    this.addedToWishlist = true;
    if (localStorage.getItem('authToken')) {
      this.bookService.addAllToWishlist(this.selectedBook).subscribe(() => {
        console.log('Book added to wishlist successfully');
      });
    } else {
      this.dataService.updateWishlistBooks(this.selectedBook);
    }
  }
}
