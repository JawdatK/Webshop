import { Component, OnInit } from '@angular/core';
import { User, Address } from '../../providers/user';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user: User;
  addresses: Address[];

  newFirstName: string;
  newLastName: string;
  newStreet: string;
  newCity: string;
  newZipCode: number;
  newPhone: string;
  setAsDefault: boolean;

  showCreate: boolean = false;
  showEdit: number;

  constructor(public afService: AuthService) { }

  ngOnInit() {
    this.afService.user$.subscribe(output => this.user = output);
    this.afService.addresses$.subscribe(output => this.addresses = output);
  }

  createAddress() {
    if(this.newPhone == undefined)
      this.newPhone = null;
    var newAddress: Address = {
      id: null,
      firstName: this.newFirstName,
      lastName: this.newLastName,
      street: this.newStreet,
      city: this.newCity,
      zip: this.newZipCode,
      phone: this.newPhone,
    }
    if(this.afService.checkAddressValidity(newAddress)) {
      // console.log("attemped creation");
      // this.afService.newAddress(this.newFirstName, this.newLastName, this.newStreet, this.newCity, this.newZipCode, this.newPhone, this.setAsDefault);
      this.afService.createAddress(newAddress, this.setAsDefault);
      this.clearNewInputs();
      this.showCreate = false;
    }
    // else {
    //   alert("Invalid address");
    // }
  }

  editAddress(thisId, newFN, newLN, newStreet, newCity, newZip, newPhone, setAsDefault) : void {
    console.log(setAsDefault);
    var editedAddress: Address = {
      id: thisId,
      firstName: newFN,
      lastName: newLN,
      street: newStreet,
      city: newCity,
      zip: newZip,
      phone: newPhone,
    }
    if(this.afService.checkAddressValidity(editedAddress)) {
      this.afService.updateAddressById(editedAddress, setAsDefault);
      this.showEdit = -1;
    }
  }

  clearNewInputs() {
    this.newFirstName = undefined;
    this.newLastName = undefined;
    this.newStreet = undefined;
    this.newCity = undefined;
    this.newZipCode = undefined;
    this.newPhone = undefined;
    this.setAsDefault = undefined;
  }

  deleteAddress(id: number) {
    if (confirm("Are you sure you want to delete the address?"))
      this.afService.removeAddress(id);
  }

}