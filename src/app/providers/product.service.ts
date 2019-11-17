import { Injectable } from '@angular/core';

//FireBase Imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import * as firebase from 'firebase/app';

//Observable and switch
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { Product } from '../providers/product';

import { GlobalService } from './global.service';
import { Global } from '../providers/global';


@Injectable()
export class ProductService {
  products: Observable<Product[]>;

  global: Global;
  constructor(public afs: AngularFirestore, public gService: GlobalService) {
    this.products = this.afs.collection<Product>('products/').valueChanges();
    this.gService.global.subscribe(global => this.global = global);
  }

  getProduct(id: number) {
    return this.afs.doc<Product>('products/' + id).valueChanges();
  }

  getProducts(parentId: number) {
    return this.afs.collection<Product>('products/', ref => ref.where('parentId', '==', '' + parentId)).valueChanges();
  }

  getAllProducts() {
    return this.afs.collection<Product>('products/').valueChanges();
  }

  getAllDeals() {
    return this.afs.collection<Product>('products/', ref => ref.where('deal', '==', true)).valueChanges();
    // .where('quantity', '>', '0')
  }

  getAllNonDeals() {
    return this.afs.collection<Product>('products/', ref => ref.where('deal', '==', false)).valueChanges();
    // .orderBy('deal').orderBy('id', 'desc')
  }


  newProduct(pId: number, n: string, desc: string, p: number, q: number, file: string, checkImage: boolean) {
    const prodRef: AngularFirestoreDocument<any> = this.afs.doc('products/' + this.global.prodIdCount);
    const data: Product = {
      id: this.global.prodIdCount,
      parentId: pId,
      name: n,
      description: desc,
      price: p,
      quantity: q,
      deal: false,
      dprice: p,
      fileUrl: file,
      isImage: checkImage,
      like: 0,
      dislike: 0,
    }
    prodRef.set(data, { merge: true });
    this.gService.addProdId(this.global.prodIdCount);
  }

  updateProduct(id: number, pId: number, n: string, desc: string, p: number, q: number, deal: boolean, dp: number, file: string, checkImage: boolean) {
    const prodRef: AngularFirestoreDocument<any> = this.afs.doc('products/' + id);
    const data: Product = {
      id: id,
      parentId: pId,
      name: n,
      description: desc,
      price: p,
      quantity: q,
      deal: deal,
      dprice: dp,
      fileUrl: file,
      isImage: checkImage,
    }
    prodRef.set(data, { merge: true });
  }

  checkFieldValidities(parentId: number, name: string, description: string, price: number, quantity: number, deal: boolean, dprice: number): boolean {
    // console.log("parentId: " + parentId,
    //             "name: " + name.trim(), name.trim().length,
    //             "desc: " + description.trim(), description.trim().length,
    //             "price: " + price, 
    //             "quantity: " + quantity, 
    //             "deal: " + deal, 
    //             "dprice: " + dprice);
    if (parentId == null || name.trim().length < 4 || description.trim().length == 0 || price == null || quantity == null || (deal && dprice == null)) {
      alert("You have to fill in all the fields");
      return false;
    }
    if(dprice > price) { //  not sure this can actually happen as it is right now
      alert("Deal of the day price mustn't be higher than the regular price");
      return false;
    }
    // console.log("validity ok");
    return true;
  }

  updateProductQuantity(productId: number, newQuantity: number) {
    this.afs.doc('products/' + productId).update({ quantity: newQuantity });
  }

  deleteProduct(id: number) {
    const prodRef: AngularFirestoreDocument<any> = this.afs.doc('products/' + id);
    prodRef.delete();
  }

  updateProductRating(id: number, l: number, dl: number) {
    const prodRef: AngularFirestoreDocument<any> = this.afs.doc('products/' + id);
    const data: any = {
      like: l,
      dislike: dl,
    }
    prodRef.set(data, { merge: true });
  }


}