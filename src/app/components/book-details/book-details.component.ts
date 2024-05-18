import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent implements OnInit {
  addedToBag: boolean = false;
  count: number = 1;
  constructor() {}

  ngOnInit(): void {}
  addToBag() {
    this.addedToBag = true;
  }
  increaseCount() {
    this.count++;
  }

  decreaseCount() {
    if (this.count > 1) {
      this.count--;
    }
  }
}
