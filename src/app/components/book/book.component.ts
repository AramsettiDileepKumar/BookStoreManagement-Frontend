import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookObj } from 'src/assets/bookInterface';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  @Input() bookObjList!: BookObj[];
  bookList: BookObj[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.currentBookList.subscribe((res) => (this.bookList = res));
  }
  handleBook(book: BookObj) {
    this.router.navigate(['/bookdetails', book.bookId]);
  }
}
