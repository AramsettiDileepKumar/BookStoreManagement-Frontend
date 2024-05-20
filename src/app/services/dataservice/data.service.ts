import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookObj } from 'src/assets/bookInterface';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  bookListState = new BehaviorSubject<BookObj[]>([]);
  currentBookList = this.bookListState.asObservable();
  changeCurrentStateBookList(value: any) {
    this.bookListState.next(value);
  }
  private cartItems: { [bookId: number]: BookObj & { quantity: number } } = {};
  private cartItemsSubject = new BehaviorSubject<
    (BookObj & { quantity: number })[]
  >([]);
  private cartItemCount = new BehaviorSubject<number>(0);
  constructor() {}

  addToCart(book: BookObj, quantity: number = 1) {
    if (book.bookId === undefined) {
      console.error('Book ID is undefined');
      return;
    }
    if (this.cartItems[book.bookId]) {
      console.log('cart');
      this.cartItems[book.bookId].quantity += quantity;
      if (this.cartItems[book.bookId].quantity < 1) {
        this.cartItems[book.bookId].quantity = 1;
      }
    } else {
      this.cartItems[book.bookId] = {
        ...book,
        quantity: quantity > 0 ? quantity : 1,
      };
    }
    this.updateCartItemsSubject();
  }
  getCartItems(): Observable<(BookObj & { quantity: number })[]> {
    return this.cartItemsSubject.asObservable();
  }
  setCartItems(cartItems: (BookObj & { quantity: number })[]): void {
    this.cartItems = {};
    cartItems.forEach((item) => {
      if (item.bookId !== undefined) {
        // Ensure bookId is not undefined
        this.cartItems[item.bookId] = item;
      } else {
        console.error('Book ID is undefined for item:', item);
      }
    });
    this.updateCartItemsSubject();
  }
  private updateCartItemsSubject() {
    const cartItemsArray = Object.values(this.cartItems);
    this.cartItemsSubject.next(cartItemsArray);
    this.cartItemCount.next(cartItemsArray.length);
  }
  updateCartItemQuantity(book: BookObj, quantity: number) {
    if (book.bookId === undefined) {
      console.error('Book ID is undefined');
      return;
    }

    if (this.cartItems[book.bookId]) {
      this.cartItems[book.bookId].quantity = quantity;
      this.updateCartItemsSubject();
    }
  }
  removeFromCart(book: BookObj) {
    if (book.bookId === undefined) {
      console.error('Book ID is undefined');
      return;
    }
    delete this.cartItems[book.bookId];
    this.updateCartItemsSubject();
  }
}
