import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DROP_DOWN } from 'src/assets/svg-icons';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookObj } from 'src/assets/bookInterface';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  bookObjList: BookObj[] = [];
  searchString: string = '';
  subscription!: Subscription;
  constructor(
    private dataService: DataService,
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral(
      'drop-down-icon',
      sanitizer.bypassSecurityTrustHtml(DROP_DOWN)
    );
  }

  ngOnInit(): void {
    this.dataService.currentBookList.subscribe(
      (res) => (this.bookObjList = res)
    );
    this.subscription = this.dataService.currentSearchString.subscribe(
      (res) => (this.searchString = res)
    );
  }
  handleBook(book: BookObj) {
    this.router.navigate(['/bookdetails', book.bookId]);
  }
}
