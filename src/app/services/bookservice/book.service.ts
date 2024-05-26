import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookObj } from 'src/assets/bookInterface';
import { HttpService } from '../httpservice/http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private httpService: HttpService) {}
  getAllCartDetails(data?: any): Observable<any> {
    return this.httpService.getAllCartDetails(data);
  }
  addBookToCart(
    book: BookObj,
    quantity: number,
    token?: string
  ): Observable<any> {
    return this.httpService.addToCart(book, quantity, token);
  }
  updateBookQuantity(
    book: BookObj,
    quantity: number,
    token?: string
  ): Observable<any> {
    return this.httpService.updateQuantity(book, quantity, token);
  }
  deleteBookFromCart(bookId: number): Observable<any> {
    return this.httpService.deleteCart(bookId);
  }
  addAllToWishlist(book: BookObj, token?: string): Observable<any> {
    return this.httpService.addToWishlist(book, token);
  }
  getAllBooksWishlist(token?: string): Observable<any> {
    return this.httpService.getAllWishlist(token);
  }
  deleteFromWishlist(bookId: number, token?: string): Observable<any> {
    return this.httpService.deleteWishlist(bookId, token);
  }
  getAddress(token?: string) {
    return this.httpService.getAddress(token);
  }
}
