import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BookService } from 'src/app/services/bookservice/book.service';
import { HttpService } from 'src/app/services/httpservice/http.service';
import { SEARCH_ICON, PROFILE_ICON, CART_ICON } from 'src/assets/svg-icons';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  loginclick: boolean = false;

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private dialog: MatDialog,
    private httpservice: HttpService,
    private bookService: BookService
  ) {
    matIconRegistry.addSvgIconLiteral(
      'search-icon',
      domSanitizer.bypassSecurityTrustHtml(SEARCH_ICON)
    ),
      matIconRegistry.addSvgIconLiteral(
        'profile-icon',
        domSanitizer.bypassSecurityTrustHtml(PROFILE_ICON)
      ),
      matIconRegistry.addSvgIconLiteral(
        'cart-icon',
        domSanitizer.bypassSecurityTrustHtml(CART_ICON)
      );
  }

  ngOnInit(): void {
    this.httpservice.getAllbook().subscribe((res) => {
      this.bookService.changeCurrentStateBookList(res);
    });
  }
}
