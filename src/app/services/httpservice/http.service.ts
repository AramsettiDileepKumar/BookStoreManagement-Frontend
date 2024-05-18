import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpclient: HttpClient) {}
  getAllbook(): Observable<any> {
    return this.httpclient.get(`https://localhost:7274/api/Book`);
  }
}
