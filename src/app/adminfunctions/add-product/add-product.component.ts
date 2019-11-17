import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CategoryService } from '../../providers/category.service';
import { ProductService } from '../../providers/product.service';
import { AuthService } from '../../providers/auth.service';

import { Category, SubCategory } from '../../providers/category';
import { Product } from '../../providers/product';
import { User } from '../../providers/user';

import { UploadFileService } from '../../providers/upload-file.service';
import { FileUpload } from '../../providers/fileupload';
import { GlobalService } from '../../providers/global.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  categories: Observable<Category[]>;
  subCategories: Observable<SubCategory[]>;
  currentSubs: SubCategory[];
  products: Product[];

  subCatId: number;
  catId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  deal: boolean;
  dp: number;
  file: string;
  newId: number;

  user: User;
  checkImg: boolean;

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = { percentage: 0 };


  constructor(public pService: ProductService,
    public afService: AuthService,
    public cService: CategoryService,
    private uploadService: UploadFileService,
    private gService: GlobalService) {
    this.gService.global.subscribe(o => this.newId = o.prodIdCount);

  }

  ngOnInit() {
    this.categories = this.cService.getAllCategories();
    this.subCategories = this.cService.getAllSubCategories();
    this.pService.products.subscribe(products => this.products = products);
    this.afService.user$.subscribe(user => this.user = user);
  }

  newProduct() {
    if(this.selectedFiles == undefined)
      alert("Please select a file");
    else if (this.pService.checkFieldValidities(this.subCatId, this.name, this.description, this.price, this.quantity, this.deal, this.dp)) {
      var file = this.selectedFiles.item(0);
      var id: number;
      this.currentFileUpload = new FileUpload(file);

      this.uploadService.pushFileToStorageAndAddDocToDB(this.currentFileUpload, this.progress, this.subCatId, this.newId, this.name.trim(), this.description.trim(), this.price, this.quantity, this.deal, this.dp, "newProduct", this.checkImg);

      // unsets input fields
      this.name = undefined;
      this.description = undefined;
      this.price = undefined;
      this.quantity = undefined;
      this.file = undefined;

      this.subCatId = undefined;
      this.catId = undefined;
      this.unsetFileUpload();
    }
  }

  selectFile(event) {
    const file = event.target.files.item(0);
    this.selectedFiles = event.target.files;

    if (file.type.match('image.*')) {
      this.checkImg = true;
    } 
    else {
      this.checkImg = false;
    }
  }

  //ugly solution to reset preloader
  unsetFileUpload() {
    setTimeout(() => {
      this.currentFileUpload = undefined;
    }, 3000);
  }

  unsetSubCatId() {
    this.subCatId = undefined;
  }

}
