import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from './../../services/api.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export interface Phone {
  name: string;
}

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})

export class EditCustomerComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('chipList', { static: true }) chipList;
  @ViewChild('resetCustomerForm', { static: true }) myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  customerForm: FormGroup;
  phoneArray: Phone[] = [];

  ngOnInit() {
    this.updateBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private customerApi: ApiService
  ) { 
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.customerApi.GetCustomer(id).subscribe(data => {
      console.log(data.phones)
      this.phoneArray = data.phones;
      this.customerForm = this.fb.group({
        name: [data.name, [Validators.required]],
        email: [data.email, [Validators.required]],
        address: [data.address, [Validators.required]],
        phones: [data.phones],
        dob: [data.dob, [Validators.required]],
        gender: [data.gender]
      })      
    })    
  }

  updateBookForm() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phones: [this.phoneArray],
      dob: ['', [Validators.required]],
      gender: ['Male']
    })
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim() && this.phoneArray.length < 5) {
      this.phoneArray.push({ name: value.trim() })
    }

    if (input) {
      input.value = '';
    }
  }

  remove(phone: Phone): void {
    const index = this.phoneArray.indexOf(phone);
    if (index >= 0) {
      this.phoneArray.splice(index, 1);
    }
  }

  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.customerForm.get('dob').setValue(convertDate, {
      onlyself: true
    })
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.customerForm.controls[controlName].hasError(errorName);
  }

  updateCustomerForm() {
    console.log(this.customerForm.value)
    var id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.customerApi.UpdateCustomer(id, this.customerForm.value).subscribe( res => {
        this.ngZone.run(() => this.router.navigateByUrl('/list-customer'))
      });
    }
  }
  
}
