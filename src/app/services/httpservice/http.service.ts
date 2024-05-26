import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookObj } from 'src/assets/bookInterface';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private authHeader = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}` || '',
  });
  constructor(private httpclient: HttpClient) {}
  getAllbook(): Observable<any> {
    return this.httpclient.get(`https://localhost:7274/api/Book`);
  }
  getAllCartDetails(token?: any) {
    if (token != '' && token != undefined) {
      return this.httpclient.get<any>(
        'https://localhost:7274/api/Cart/GetCartBooks',
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}` || '',
          }),
        }
      );
    }
    return this.httpclient.get<any>(
      'https://localhost:7274/api/Cart/GetCartBooks',
      { headers: this.authHeader }
    );
  }
  loginApi(email: string, password: string): Observable<any> {
    return this.httpclient.post(`https://localhost:7274/api/User/Login`, {
      email: email,
      password: password,
    });
  }
  addToCart(book: BookObj, quantity: number, token?: string): Observable<any> {
    const requestBody = { bookId: book.bookId, quantity };
    if (token != '' && token != undefined) {
      const req = { bookId: book, quantity };
      return this.httpclient.post<any>(
        'https://localhost:7274/api/Cart/AddToCart',
        req,
        {
          headers: new HttpHeaders({
            //'Accept': "application/json",
            Authorization: `Bearer ${token}` || '',
          }),
        }
      );
    }
    return this.httpclient.post<any>(
      'https://localhost:7274/api/Cart/AddToCart',
      requestBody,
      { headers: this.authHeader }
    );
  }
  updateQuantity(
    book: BookObj,
    quantity: number,
    token?: string
  ): Observable<any> {
    const requestBody = { bookId: book.bookId, quantity };
    if (token != '' && token != undefined) {
      const req = { bookId: book, quantity };
      return this.httpclient.put<any>(
        'https://localhost:7274/api/Cart/UpdateQuantity',
        req,
        {
          headers: new HttpHeaders({
            //'Accept': "application/json",
            Authorization: `Bearer ${token}` || '',
          }),
        }
      );
    }
    return this.httpclient.put<any>(
      'https://localhost:7274/api/Cart/UpdateQuantity',
      requestBody,
      { headers: this.authHeader }
    );
  }
  deleteCart(bookId: number): Observable<any> {
    const url = `https://localhost:7274/api/Cart/DeleteCart?BookId=${bookId}`;
    return this.httpclient.delete<any>(url, { headers: this.authHeader });
  }
  addToWishlist(book: BookObj, token?: string): Observable<any> {
    if (token !== '' && token !== undefined) {
      return this.httpclient.post<any>(
        `https://localhost:7274/api/WishList/addwishlist${book.bookId}`,
        {},
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}` || '',
          }),
        }
      );
    }
    return this.httpclient.post<any>(
      `https://localhost:7274/api/WishList/addwishlist${book.bookId}`,
      {},
      { headers: this.authHeader }
    );
  }
  getAllWishlist(token?: string): Observable<any> {
    if (token !== '' && token !== undefined) {
      return this.httpclient.get<any>(
        'https://localhost:7274/api/WishList/GetWishlistBooks',
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}` || '',
          }),
        }
      );
    }
    return this.httpclient.get<any>(
      'https://localhost:7274/api/WishList/GetWishlistBooks',
      { headers: this.authHeader }
    );
  }
  deleteWishlist(bookId: number, token?: string): Observable<any> {
    const url = `https://localhost:7274/api/WishList/DeleteWishlist/${bookId}`;
    if (token !== '' && token !== undefined) {
      return this.httpclient.delete<any>(url, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}` || '',
        }),
      });
    }
    return this.httpclient.delete<any>(url, { headers: this.authHeader });
  }
  getAddress(token?: string) {
    if (token !== '' && token !== undefined) {
      return this.httpclient.get<any>(`https://localhost:7274/api/Address`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}` || '',
        }),
      });
    }
    return this.httpclient.get(`https://localhost:7274/api/Address`, {
      headers: this.authHeader,
    });
  }
  updataAddress(data: any) {
    return this.httpclient.put(
      `https://localhost:7274/api/Address/updateAddress${data.addressId}`,
      data,
      {
        headers: this.authHeader,
      }
    );
  }
  addAddress(data: any) {
    return this.httpclient.post(
      `https://localhost:7274/api/Address/addAddress
    `,
      data,
      {
        headers: this.authHeader,
      }
    );
  }
  removeAddress(data: any) {
    return this.httpclient.delete(
      `https://localhost:7274/api/Address/deleteAddress${data}`,
      {
        headers: this.authHeader,
      }
    );
  }
}
