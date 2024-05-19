import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookObj } from 'src/assets/bookInterface';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent implements OnInit {
  addedToBag: boolean = false;
  selectedBook!: BookObj;
  count: number = 1;
  constructor(
    private dataService: DataService,
    private bookService:BookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataService.currentStateBookList.subscribe((res1) => {
      this.route.params.subscribe((res2) => {
        this.selectedBook = res1.filter((e) => e.bookId == res2['bookId'])[0];
      });
    });
  }
  addToBag() {
    this.addedToBag = true;
    this.dataService.addToCart(this.selectedBook, this.count);
    this.bookService.addBookToCart(this.selectedBook, this.count).subscribe(() => {
      console.log('Book added to cart successfully');
    });
  }
  increaseCount() {
    this.count++;
    
  }

  decreaseCount() {
    if (this.count > 1) {
      this.count--;
    }
  }
}
