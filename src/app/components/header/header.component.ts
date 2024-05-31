import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { HttpService } from 'src/app/services/httpservice/http.service';
import { SEARCH_ICON, PROFILE_ICON, CART_ICON } from 'src/assets/svg-icons';
import { LoginComponent } from '../login/login.component';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  loginLogOut: boolean = true;
  searchString: string = '';
  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private dialog: MatDialog,
    private httpservice: HttpService,
    private dataService: DataService,
    private router: Router,
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
    this.bookService.getAllBooks().subscribe((res) => {
      this.dataService.changeState(res);
    });
    if (localStorage.getItem('authToken')) {
      this.loginLogOut = false;
      this.bookService
        .getAllCartDetails()
        .subscribe((res) => this.dataService.setAllCartItems(res.data));
      this.bookService
        .getAllBooksWishlist()
        .subscribe((res) => this.dataService.updateWishlist(res.data));
      this.bookService.getAddress().subscribe((res: any) => {
        this.dataService.updateAddressList(res.data);
      });
      this.httpservice
        .getOrderList()
        .subscribe((res) => this.dataService.updateOrderList(res));
    }
  }
  login() {
    this.loginLogOut = false;
    const dialogRef = this.dialog.open(LoginSignupComponent, {
      width: '720px',
      height: '480px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  logOut() {
    localStorage.clear();
    this.router.navigate(['/books']);
    this.dataService.clearBooksList();
    this.dataService.clearCartItems();
    this.dataService.clearWishlist();
    this.dataService.clearAddressList();
  }
  wishlist() {
    this.router.navigate(['/wishlist']);
  }
  handleSearchString() {
    this.dataService.updateSearchString(this.searchString);
  }
}
