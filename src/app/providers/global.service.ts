import { Injectable } from '@angular/core';

//FireBase Imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

//Observable and switch
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { Global } from '../providers/global';

@Injectable()
export class GlobalService {

  global: Observable<Global>;

  constructor(public afs: AngularFirestore) {
      this.global = this.afs.doc<Global>('data/global').valueChanges(); //Global gets the values from data in db.
  }

  addSubId(id: number) : void {
    const gRef: AngularFirestoreDocument<any> = this.afs.doc('data/global');
    const data: Global = {
      subIdCount: id+1,
    }
    gRef.set(data, {merge: true});
  }

  addProdId(id: number) : void {
    const gRef: AngularFirestoreDocument<any> = this.afs.doc('data/global');
    const data: Global = {
      prodIdCount: id+1,
    }
    gRef.set(data, {merge: true});
  }

  increaseOrderId(id: number) : void {
    var newId = id + 1;
    if(id == undefined)
      newId = 0;
    const gRef: AngularFirestoreDocument<any> = this.afs.doc('data/global');
    const data: Global = {
      orderIdCount: newId,
    }
    gRef.set(data, {merge: true});
  }

  getDate() {
    var date = new Date();
    var YY = date.getFullYear();
    
    var M = date.getMonth() + 1;
    var MM: string = "" + M;
    if(M < 10)
      MM = "0" + M;
    
    var D = date.getDate();
    var DD: string = "" + D;
    if(D < 10)
      DD = "0" + D;

    var h = date.getHours();
    var hh: string = "" + h;
    if(h < 10)
      hh = "0" + h;
    
      var m = date.getMinutes();
      var mm: string = "" + m;
      if(m < 10)
        mm = "0" + m;
     
    return YY + "-" + MM + "-" + DD + " " + hh + ":" + mm;
  }
}
