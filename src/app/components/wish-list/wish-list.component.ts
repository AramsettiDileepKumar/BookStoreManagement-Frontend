import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { BookObj } from 'src/assets/bookInterface';
import { DELETE_FOREVER_ICON } from 'src/assets/svg-icons';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {
  wishlistBooks: BookObj[] = [];

  constructor(
    private dataService: DataService,
    private bookService: BookService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private cdr: ChangeDetectorRef
  ) {
    matIconRegistry.addSvgIconLiteral(
      'delete-icon',
      domSanitizer.bypassSecurityTrustHtml(DELETE_FOREVER_ICON)
    );
  }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.dataService.currWishlist.subscribe(
      (res) => (this.wishlistBooks = res)
    );
    // if (localStorage.getItem('authToken')) {
    //   this.bookService.getAllBooksWishlist().subscribe(
    //     (books) => {
    //       this.wishlistBooks = books.data;
    //     },
    //     (error) => {
    //       console.error('Error fetching wishlist books:', error);
    //     }
    //   );
    // } else {
    //   console.log('Auth token not present. Loading wishlist from local data.');
    //   this.dataService.currWishlist.subscribe((wishlist) => {
    //     console.log('Local wishlist:', wishlist);
    //     this.wishlistBooks = [...wishlist];
    //   });
    // }
  }
  removeFromWishlist(bookId: number) {
    if (localStorage.getItem('authToken')) {
      this.bookService.deleteFromWishlist(bookId).subscribe(
        () => {
          console.log('Book removed from wishlist.');
          this.wishlistBooks = this.wishlistBooks.filter(
            (book) => book.bookId !== bookId
          );
        },
        (error) => {
          console.error('Error removing book from wishlist:', error);
        }
      );
    } else {
      this.wishlistBooks = this.wishlistBooks.filter(
        (book) => book.bookId !== bookId
      );
    }
  }
}
