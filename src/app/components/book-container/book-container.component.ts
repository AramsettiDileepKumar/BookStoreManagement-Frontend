import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookObj } from 'src/assets/bookInterface';

@Component({
  selector: 'app-book-container',
  templateUrl: './book-container.component.html',
  styleUrls: ['./book-container.component.scss'],
})
export class BookContainerComponent implements OnInit {
  booksList: BookObj[] = [];
  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    this.dataservice.currentBookList.subscribe((res) => (this.booksList = res));
  }
}
