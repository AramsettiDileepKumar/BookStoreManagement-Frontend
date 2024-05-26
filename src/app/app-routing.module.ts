import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './components/book/book.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { LoginComponent } from './components/login/login.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { OrderComponent } from './components/order/order.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'loginSignUp',
    component: LoginSignupComponent,
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'books',
        component: BookComponent,
      },
      {
        path: 'bookdetails/:bookId',
        component: BookDetailsComponent,
      },
      {
        path: 'cart',
        component: CartDetailsComponent,
      },
      {
        path: 'wishlist',
        component: WishListComponent,
      },
      {
        path: 'customer',
        component: CustomerDetailsComponent,
      },
      {
        path: 'orders',
        component: OrderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
