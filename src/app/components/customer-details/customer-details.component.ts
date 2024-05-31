import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/bookservice/book.service';
import { DataService } from 'src/app/services/dataservice/data.service';
import { HttpService } from 'src/app/services/httpservice/http.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  customerForm: FormGroup;
  showAddNewAddress: boolean = false;
  editaddress: boolean = true;
  showIcons: boolean = false;
  editadd: any = {};
  addressList: any[] = [];
  orderaddress: any;
  addressForm!: FormGroup;
  typeDisplayMap: { [key: string]: string } = {
    '1': 'Home',
    '2': 'Work',
    '3': 'Other',
  };
  emptyAddress: any = {
    addressId: null,
    name: '',
    mobileNumber: '',
    address: '',
    city: '',
    state: '',
    type: '',
  };

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private httpService: HttpService
  ) {
    this.customerForm = this.fb.group({
      fullName: ['', Validators.required],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAddresses();
    this.addressForm = this.fb.group({
      name: [this.emptyAddress.name, Validators.required],
      mobileNumber: [
        this.emptyAddress.mobileNumber,
        [Validators.required, Validators.pattern('[0-9]{10}')],
      ],
      address: [this.emptyAddress.address, Validators.required],
      city: [this.emptyAddress.city, Validators.required],
      state: [this.emptyAddress.state, Validators.required],
      type: [this.emptyAddress.type, Validators.required],
    });
  }
  loadAddresses() {
    this.dataService.currAddressList.subscribe((res: any) => {
      this.addressList = res;
    });
  }

  removeAddress(addressId: number) {
    this.httpService.removeAddress(addressId).subscribe((res) => {
      this.loadAddresses();
    });
  }
  editAddress(address: any) {
    this.showAddNewAddress = true;
    this.showIcons = true;
    this.editaddress = false;
    this.editadd = address;
    this.addressForm.patchValue({
      addressId: address.addressId,
      name: address.name,
      mobileNumber: address.mobileNumber,
      address: address.address,
      city: address.city,
      state: address.state,
      type: address.type,
      userId: address.userId,
    });
  }
  handleaddress() {
    if (this.addressForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    this.showAddNewAddress = false;
    this.showIcons = false;

    const userData = this.addressForm.value;
    if (this.editadd && this.editadd.addressId) {
      userData.addressId = this.editadd.addressId;
      this.httpService.updataAddress(userData).subscribe(
        (res: any) => {
          console.log(res);
          this.loadAddresses();
        },
        (err: any) => console.log(err)
      );
    } else {
      console.log(userData);

      this.httpService.addAddress(userData).subscribe(
        (res) => {
          console.log(res);
          this.loadAddresses();
        },
        (err) => console.log(err)
      );
    }
    this.editaddress = true;
  }
  handleContinue(data: any) {
    this.dataService.toggleOrderSummary();
    this.showIcons = true;
    this.showAddNewAddress = true;
    this.orderaddress = data;
  }
}
