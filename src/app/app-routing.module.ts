import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './components/book/book.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookContainerComponent } from './components/book-container/book-container.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { LoginComponent } from './components/login/login.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';

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
    component: DashboardComponent,
    children: [
      {
        path: 'books',
        component: BookContainerComponent,
      },
      {
        path: 'bookdetails/:bookId',
        component: BookDetailsComponent,
      },
      {
        path: 'cart',
        component: CartDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
