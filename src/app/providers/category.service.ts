import { Injectable } from '@angular/core';

//FireBase Imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

//Observable and switch
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { Category, SubCategory } from '../providers/category';

import { GlobalService } from './global.service';
import { Global } from '../providers/global';


@Injectable()
export class CategoryService {
  categories: Observable<Category[]>;
  subCategories: Observable<SubCategory[]>;

  global: Global;
  constructor(public afs: AngularFirestore, public gService: GlobalService) {
      this.categories = this.afs.collection<Category>('mainCategory/').valueChanges();
      this.subCategories = this.afs.collection<SubCategory>('subCategory/').valueChanges();
      this.gService.global.subscribe(global => this.global = global);
  }

  getAllCategories() {
    return this.afs.collection<Category>('mainCategory/').valueChanges();
  }

  getAllSubCategories() {
    return this.afs.collection<SubCategory>('subCategory/').valueChanges();
  }

  getCategory(id: number) {
    return this.afs.doc<Category>('mainCategory/' + id).valueChanges();
  }

  getSubCategory(id: number) {
    return this.afs.doc<SubCategory>('subCategory/' + id).valueChanges();
  }

  newSubCategory(id: number, n: string) {
    const subRef: AngularFirestoreDocument<any> = this.afs.doc('subCategory/'+this.global.subIdCount+'');
    const data: SubCategory = {
      parentId: id,
      name: n,
      uid: this.global.subIdCount,
    }
    subRef.set(data, {merge: true});
    this.gService.addSubId(this.global.subIdCount);
  }

}
