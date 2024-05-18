import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookObj } from 'src/assets/bookInterface';
import { HttpService } from '../httpservice/http.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksList = new BehaviorSubject<BookObj[]>([]);
  private bookList: BookObj[] = [];
  bookListState = new BehaviorSubject<BookObj[]>([]);
  currentStateBookList = this.bookListState.asObservable();
  changeCurrentStateBookList(value: any) {
    this.bookListState.next(value);
  }
  constructor(private httpservice: HttpService) {}
}
