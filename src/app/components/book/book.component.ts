import { Component, OnInit, Input } from '@angular/core';
import { BookService } from 'src/app/services/bookservice/book.service';
import { BookObj } from 'src/assets/bookInterface';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  @Input() bookObjList!: BookObj[];
  bookList: BookObj[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.currentStateBookList.subscribe(
      (res) => (this.bookList = res)
    );
  }
}
