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
  getAllCartDetails() {
    return this.httpclient.get(`https://localhost:7274/api/Cart/GetCartBooks`, { headers: this.authHeader });
  }
  loginApi(email: string, password: string): Observable<any> {
    return this.httpclient.post(`https://localhost:7274/api/User/Login`, {
      email: email,
      password: password,
    });
  }
  addToCart(book: BookObj, quantity: number): Observable<any> {
    const requestBody = { bookId: book.bookId, quantity };
    return this.httpclient.post<any>('https://localhost:7274/api/Cart/AddToCart', requestBody, { headers: this.authHeader });
  }
}
