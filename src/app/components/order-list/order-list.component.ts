import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/dataservice/data.service';
import { HttpService } from 'src/app/services/httpservice/http.service';
import { BookObj } from 'src/assets/bookInterface';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  orderList!: any[];

  constructor(
    private dataService: DataService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('authToken') != null) {
      this.dataService.currOrderList.subscribe(
        (res) => {
          this.orderList = res;
        },
        (err) => console.log(err)
      );
      // this.httpService
      //   .getOrderList()
      //   .subscribe((res) => (this.orderList = res));
    }
  }
}
