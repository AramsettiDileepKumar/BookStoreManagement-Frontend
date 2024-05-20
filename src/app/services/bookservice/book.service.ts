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
  addBookToCart(book: BookObj, quantity: number): Observable<any> {
    return this.httpService.addToCart(book, quantity);
  }
  updateBookQuantity(book: BookObj, quantity: number): Observable<any> {
    return this.httpService.updateQuantity(book, quantity);
  }
  deleteBookFromCart(bookId: number): Observable<any> {
    return this.httpService.deleteCart(bookId);
  }
}
