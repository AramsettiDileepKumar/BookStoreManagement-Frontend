import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormStyle } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BookComponent } from './components/book/book.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { BookContainerComponent } from './components/book-container/book-container.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { LoginComponent } from './components/login/login.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { MatFormField } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BookComponent,
    BookDetailsComponent,
    BookContainerComponent,
    DashboardComponent,
    CartDetailsComponent,
    LoginComponent,
    LoginSignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
