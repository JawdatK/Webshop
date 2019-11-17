import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../providers/auth.service';
import { User, Basket, Address } from '../../providers/user';
import { Product } from '../../providers/product';

import { Observable } from '@firebase/util';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap } from 'rxjs/operators';
import { ProductService } from '../../providers/product.service';

@Component({
  selector: 'app-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  styleUrls: ['./shopping-basket.component.css']
})
export class ShoppingBasketComponent implements OnInit {

  basket: Basket[];
  currentUser: User;
  products: Product[];
  addresses: Address[];

  totalQuantity: number = 0;
  totalPrice: number = 0;

  step2: boolean;

  currentAddress: Address;

  constructor(public afService: AuthService,
    public afs: AngularFirestore,
    public pService: ProductService,
  ) { }

  ngOnInit() {
    this.afs.collection<Product>('products/').valueChanges().subscribe(o => this.products = o);

    this.afService.user$.subscribe(user => {
      this.currentUser = user;
      if(user) {
        this.afService.getAddress(user.defaultId, user.uid).subscribe(defaultAddress => {
        if (defaultAddress) {
          this.currentAddress = defaultAddress;
        }
        else {
          this.currentAddress = {
            id: null,
            firstName: null,
            lastName: null,
            street: null,
            city: null,
            zip: null,
            phone: null,
          }
        }
      });
        
      this.afService.basket$.subscribe(basket => {
        this.basket = basket;
        // poor solution w. looping through all products. 
        // re-calculates total quantity and price every time a change is made to the basket.
        this.totalQuantity = 0;
        this.totalPrice = 0;
        if (this.products) {
          for (let prod of this.products) {
            if (this.basket) {
              for (let item of this.basket) {
                if (prod.id == item.id) {
                  this.totalQuantity += item.quantity;
                  if (prod.deal)
                    this.totalPrice += (item.quantity * prod.dprice);
                  else
                    this.totalPrice += (item.quantity * prod.price);
                }
              }
            }
          }
        }
      });
    }
    });

    this.afService.addresses$.subscribe(o => this.addresses = o);
  }

  decreaseQ(id: number, quantity: number) {
    if (quantity > 0) { // extra security check
      this.afService.updateBasketById(id, quantity - 1);
    }
  }

  increaseQ(id: number, quantity: number, stock: number) {
    if (quantity < stock) { // extra security check
      this.afService.updateBasketById(id, quantity + 1);
    }
  }

  deleteItem(id: number, quantity: number, price: number) {
    this.afService.deleteBasketById(id);
  }

  toStep2() {
    if (this.afService.checkBasketQuantities(this.basket)) {
      this.step2 = true;
    }
  }

  setAddress() {
    this.afService.getAddress(this.currentAddress.id, this.currentUser.uid).subscribe(obj => {
      this.currentAddress = obj;
    });
  }

  clearAddress() {
    this.currentAddress.id = null;
    this.currentAddress.firstName = null;
    this.currentAddress.lastName = null;
    this.currentAddress.city = null;
    this.currentAddress.zip = null;
    this.currentAddress.phone = null;
    this.currentAddress.street = null;
  }
}
