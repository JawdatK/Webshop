import { Injectable } from '@angular/core';
//FireBase Imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

//Observable and switch
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { User, Basket, Address, Order, Votes } from './user';
import { ProductService } from './product.service';
import { Product } from './product';

import { Global } from './global';
import { GlobalService } from './global.service';
import { Router } from '@angular/router';
import { ShoppingBasketComponent } from '../pages/shopping-basket/shopping-basket.component';
import { isNumber } from 'util';

@Injectable()
export class AuthService {
  user$: Observable<User>; //User variable used locally, Observable ( Gets changes)
  basket$: Observable<Basket[]>;
  addresses$: Observable<Address[]>;
  votes$: Observable<Votes[]>;
  global: Global;
  allProducts: Product[];
  private idCarry: String;
  votes: number[];
  addressId: number;
  basket: Basket[];
  // basketProdRef;

  //Constructor the user is watching the stored user in the database or if the user does not exist it watches null.
  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public pService: ProductService,
    private gService: GlobalService,
    private router: Router) {
    this.user$ = afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<User>('users/' + user.uid + '').valueChanges();
      }
      else {
        return Observable.of(null);
      }
    });
    this.basket$ = this.user$.switchMap(user => {
      if (user) {
        this.user$.subscribe(user => this.idCarry = user.uid);
        this.user$.subscribe(user => this.votes = user.voted);

        return this.afs.doc<User>('users/' + user.uid + '').collection<Basket>('basket').valueChanges();
      }
      else {
        return Observable.of(null);
      }
    });
    this.addresses$ = this.user$.switchMap(user => {
      if (user) {
        this.user$.subscribe(user => this.idCarry = user.uid);
        this.user$.subscribe(user => this.addressId = user.addressId);
        return this.afs.doc<User>('users/' + user.uid + '').collection<Address>('address').valueChanges();
      }
      else {
        return Observable.of(null);
      }
    });
    this.votes$ = this.user$.switchMap(user => {
      if (user) {
        return this.afs.doc<User>('users/' + user.uid + '').collection<Votes>('votes').valueChanges();
      }
      else {
        return Observable.of(null);
      }
    });
    //If it's a user, assign the basket the value of the user.
    this.gService.global.subscribe(global => this.global = global);
    this.pService.products.subscribe(products => this.allProducts = products);
    this.basket$.subscribe(o => this.basket = o);
  }
  /*
  Google authentication and database code. (Methods)
  */
  // Logging in with the authenticator provider provided by google.
  // Updates the user with the credentials from the google account.
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then((credential) => {
      this.updateUser(credential.user);
    });
  }
  // Logs out from google.
  googleLogOut() {
    this.afAuth.auth.signOut();
  }

  // Updates the user from the firestoreDocument with the interface created in user.ts
  // Uses the values fetched from the credentials from the google account.
  // Does not edit the admin part.
  updateUser(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + user.uid + '');
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }
    return userRef.set(data, { merge: true });
  }




  //Update
  hasVoted(id: number): boolean {
    if (this.user$) {
      if (this.votes == null) {
        return false;
      }
      return this.votes.some(function (element, index, array) { return element == id; }); //Returns true if the array contains a the id. That means that the user has voted.
    }

    return true;
  }
  //Working
  whichVote(id: number, user: User, votes: Votes[]) {
    if (votes) {
      for (let x of votes) {
        if (x.id == id) {
          if (x.vote > 0) { return 1; }
          else if (x.vote < 0) { return -1; }
        }
      }
    }
    return 0; // No vote.
  }
  //Redo
  setVoteById(id: number) //Vote by id.
  {
    if (this.user$) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + this.idCarry + '');
      var t: number[];
      if (this.votes == null) {
        t = [id];
      }
      else {
        t = this.votes;
        t.push(id);
      }

      const data: User = {
        voted: t,
      }
      return userRef.set(data, { merge: true });
    }
  }
  //Working 2
  setVoteById2(id: number, user: User, vote: number) {
    if (this.user$) {
      const voteRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + user.uid + '/votes/' + id);

      const data: Votes = {
        id: id,
        vote: vote,
      }
      return voteRef.set(data, { merge: true });
    }
  }




  updateBasketById(id: number, quant: number) //Used for increase/decrease quantity and add a new product to basket.
  {
    if (this.user$) {
      const basketRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + this.idCarry + '/basket/' + id);
      const data: Basket = {
        id: id,
        quantity: quant,
      }
      return basketRef.set(data, { merge: true });
    }
  }

  checkIfAddItemToBasketIsOk(productId: number, quantityChange: number) {
    if (this.basket) {
      for (let item of this.basket) {
        this.pService.getProduct(productId).subscribe(product => {
          if (item.id == productId) {
            if (item.quantity + quantityChange <= product.quantity)
              return true;
            else
              return false;
          }
        });
      }
    }
    return true;
  }

  addToBasket(productId: number, quantityChange: number) {
    for (let product of this.allProducts) {
      for (let item of this.basket) {
        if (item.id == productId && item.id == product.id) {
          if (item.quantity + quantityChange <= product.quantity) {
            var newQuantity = item.quantity + quantityChange;
            this.afs.doc('users/' + this.idCarry + '/basket/' + productId).set({ id: productId, quantity: newQuantity });
          }
          else {
            alert("Cannot add any more items to basket: not enough items in stock.");
          }
          return;
        }
      }
    }
    this.afs.doc('users/' + this.idCarry + '/basket/' + productId).set({ id: productId, quantity: quantityChange });
  }

  deleteBasketById(id: number) {
    if (this.user$) {
      const basketRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + this.idCarry + '/basket/' + id);
      return basketRef.delete();
    }
  }

  checkBasketQuantities(orderItems: Basket[]): boolean {
    var quantityOk: boolean = true;
    for (let item of orderItems) {
      for (let product of this.allProducts) {
        if (product.id == item.id) {
          if (item.quantity > product.quantity) {
            this.updateBasketById(item.id, product.quantity)
            quantityOk = false;
            alert("There's not enough items in stock to buy " + item.quantity + " x " + product.name + ". The quantities of your basket has been updated to the available quantity.")
            return false;
          }
          if (item.quantity == 0) {
            quantityOk = false;
            alert("Error: Product quantity cannot be zero");
            return false;
          }
          break;
        }
      }
    }
    return true;
  }




  getAddress(id: number, userUid: string) {
    return this.afs.doc<Address>('users/' + userUid + '/address/' + id).valueChanges();
  }

  createAddress(address: Address, setAsDefault: boolean) {
    if (this.user$) {
      var newId = 0;
      if (this.addressId != null)
        newId = this.addressId + 1;
      address.id = newId;
      const addressRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + this.idCarry + '/address/' + newId);
      if (setAsDefault) {
        this.setUserDefaultAddress(newId);
      }
      this.addressIdGain();
      addressRef.set(address, { merge: true });
    }
  }

  updateAddressById(address: Address, setAsDefault: boolean) {
    if (this.user$) {
      const addressRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + this.idCarry + '/address/' + address.id);
      if (setAsDefault) {
        this.setUserDefaultAddress(address.id);
      }
      return addressRef.set(address, { merge: true });
    }
  }

  removeAddress(id: number) {
    if (this.user$) {
      const addressRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + this.idCarry + '/address/' + id);
      return addressRef.delete();
    }
  }

  addressIdGain() //Adds to the id counter.
  {
    if (this.user$) {
      var id = 0;
      if (this.addressId != null) {
        id = this.addressId + 1;
      }
      const userRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + this.idCarry + '');
      const data: User = {
        addressId: id,
      }
      return userRef.set(data, { merge: true });
    }
  }

  setUserDefaultAddress(addressId: number)
  {
    if (this.user$) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + this.idCarry + '');
      const data: User = {
        defaultId: addressId,
      }
      return userRef.set(data, { merge: true });
    }
  }

  checkAddressValidity(address: Address): boolean {
    var checkFail: boolean;
    if (address.firstName == undefined || address.lastName == undefined || address.street == undefined || address.zip == undefined || address.city == undefined)
      checkFail = true;
    else if (address.firstName.trim().length < 3 || address.lastName.trim().length < 3 || address.street.trim().length < 4 || address.zip < 1 || address.city.trim().length < 2)
      checkFail = true;
    if ((address.phone != undefined && address.phone.trim().length > 0 && address.phone.trim().length < 5)) // !isNumber(address.phone
      checkFail = true;

    if (checkFail) {
      alert("Address was not filled in correctly");
      return false;
    }
    // for(let i = 0; i < address.phone.trim().length; i ++) {
    //   console.log(address.phone.charAt[i]);
    //   if(!isNumber(address.phone.charAt(i))) {
    //     return false;
    //   }
    // }
    return true;
  }




  getAllOrders(user: User) {
    if (user) {
      return this.afs.collection<Order>('users/' + user.uid + '/orders').valueChanges();
    }
  }

  createOrder(orderItems: Basket[], address: Address, saveAddress) {
    if (this.user$) {
      if (!this.checkAddressValidity(address)) {
        return;
      }
      if (saveAddress && address.id == null) {
        var newAddress: Address = {
          id: address.id,
          firstName: address.firstName,
          lastName: address.lastName,
          street: address.street,
          city: address.city,
          zip: address.zip,
          phone: address.phone,
        }
        this.createAddress(newAddress, false);
      }
      var quantityOk: boolean = true;
      var quantitySum: number = 0;
      var priceSum: number = 0;
      for (let item of orderItems) {
        // bad implementation looping through all products
        var relevantPrice: number;
        for (let product of this.allProducts) {
          if (product.id == item.id) {
            relevantPrice = product.price;
            if (product.deal)
              relevantPrice = product.dprice;
            item.price = relevantPrice;
            item.name = product.name;
            if (product.isImage)
              item.imageUrl = product.fileUrl;

            if (item.quantity > product.quantity) {
              this.updateBasketById(item.id, product.quantity)
              quantityOk = false;
              alert("Error: Not enough items in stock. Your quantities has been updated");
            }
            if (item.quantity == 0) {
              quantityOk = false;
              alert("Error: Product quantity cannot be zero");
            }
            quantitySum += item.quantity;
            priceSum += relevantPrice * item.quantity;
            break; // abort loop when product is found
          }
        }
      }
      if (quantityOk) {
        this.gService.increaseOrderId(this.global.orderIdCount);
        this.insertOrderIntoDB(this.global.orderIdCount, orderItems, address, priceSum, quantitySum);

        // empties basket and updates product quantities
        for (let item of orderItems) {
          for (let product of this.allProducts) {
            if (product.id == item.id) {
              this.deleteBasketById(item.id);
              this.pService.updateProductQuantity(item.id, product.quantity - item.quantity);
              break;
            }
          }
        }
        this.router.navigateByUrl("/view-orders/" + this.global.orderIdCount);
      }
    }
  }

  insertOrderIntoDB(id: number, orderItems: Basket[], address: Address, priceSum: number, quantitySum: number) {
    var dateStamp = this.gService.getDate();
    const orderRef: AngularFirestoreDocument<Order> = this.afs.doc('users/' + this.idCarry + '/orders/' + this.global.orderIdCount);
    const data: Order = {
      id: this.global.orderIdCount,
      items: orderItems,
      deliveryAddress: address,
      status: "Shipped",
      date: dateStamp,
      totalPrice: priceSum,
      totalQuantity: quantitySum,
    }
    orderRef.set(data, { merge: true });
  }

}