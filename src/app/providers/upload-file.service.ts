import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

import { FileUpload } from './fileupload';
import { ProductService } from './product.service';

@Injectable()
export class UploadFileService {

    private basePath = '/uploads';

    constructor(private db: AngularFireDatabase,
                private pService: ProductService) { }

    pushFileToStorageAndAddDocToDB(fileUpload: FileUpload, progress: { percentage: number }, pId: number, xId: number, n: string, desc: string, p: number, q: number, deal:boolean, dp: number, checkFunc: string, imgBoolean: boolean) {
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`${this.basePath}/${xId}/${fileUpload.file.name}`).put(fileUpload.file);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // in progress
                const snap = snapshot as firebase.storage.UploadTaskSnapshot;
                progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            },
            (error) => {
                // fail
                console.log(error);
            },
            () => {
                // success
                if(checkFunc == "newProduct"){
                    this.pService.newProduct(pId, n, desc, p, q, uploadTask.snapshot.downloadURL,imgBoolean);
                }
                else if (checkFunc == "updateProduct"){ 
                    this.pService.updateProduct(xId, pId, n, desc, p, q, deal, dp, uploadTask.snapshot.downloadURL,imgBoolean);
                }
            }
        );
      }

}
