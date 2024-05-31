import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { BookObj } from 'src/assets/bookInterface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private booksList = new BehaviorSubject<BookObj[]>([]);
  currentBookList = this.booksList.asObservable();
  changeState(value: BookObj[]) {
    this.booksList.next(value);
  }
  private allCartItemsSubject = new BehaviorSubject<any[]>([]);
  currCartList = this.allCartItemsSubject.asObservable();
  setAllCartItems(cartItems: any[]) {
    this.allCartItemsSubject.next(cartItems);
  }
  private wishlistBooks = new BehaviorSubject<BookObj[]>([]);
  currWishlist = this.wishlistBooks.asObservable();
  updateWishlistBooks(book: BookObj) {
    const currentWishlist = this.wishlistBooks.getValue();
    this.wishlistBooks.next([...currentWishlist, book]);
  }
  updateWishlist(books: BookObj[]) {
    this.wishlistBooks.next(books);
  }
  private allAddressList = new BehaviorSubject<any[]>([]);
  currAddressList = this.allAddressList.asObservable();
  updateAddressList(list: any) {
    this.allAddressList.next(list);
  }
  private OrderList = new BehaviorSubject<any[]>([]);
  currOrderList = this.OrderList.asObservable();
  updateOrderList(data: any[]) {
    this.OrderList.next(data);
    console.log('hello');
  }
  private searchstring = new BehaviorSubject('');
  currentSearchString = this.searchstring.asObservable();
  updateSearchString(state: string) {
    this.searchstring.next(state);
  }
  addToCart(book: BookObj, quantity: number = 1) {
    if (book.bookId === undefined) {
      console.error('Book ID is undefined');
      return;
    }
    const currentItems = this.allCartItemsSubject.getValue();
    const itemIndex = currentItems.findIndex(
      (item) => item.bookId === book.bookId
    );
    if (itemIndex > -1) {
      currentItems[itemIndex].quantity += quantity;
      if (currentItems[itemIndex].quantity < 1) {
        currentItems[itemIndex].quantity = 1;
      }
    } else {
      currentItems.push({
        ...book,
        quantity: quantity > 0 ? quantity : 1,
      });
    }
    this.allCartItemsSubject.next(currentItems);
  }
  removeFromCart(book: BookObj): void {
    if (book.bookId === undefined) {
      console.error('Book ID is undefined');
      return;
    }

    const currentItems = this.allCartItemsSubject.getValue();
    const updatedItems = currentItems.filter(
      (item) => item.bookId !== book.bookId
    );

    this.allCartItemsSubject.next(updatedItems);
  }
  //------
  private orderSummaryToggledSource = new Subject<void>();
  orderSummaryToggled = this.orderSummaryToggledSource.asObservable();
  toggleOrderSummary() {
    this.orderSummaryToggledSource.next();
  }
  //-----------------------
  clearBooksList() {
    this.booksList.next([]);
  }

  clearCartItems() {
    this.allCartItemsSubject.next([]);
  }

  clearWishlist() {
    this.wishlistBooks.next([]);
  }

  clearAddressList() {
    this.allAddressList.next([]);
  }
  constructor() {}
}
