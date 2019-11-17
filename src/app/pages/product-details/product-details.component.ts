import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from '../../providers/category.service';
import { ProductService } from '../../providers/product.service';
import { AuthService } from '../../providers/auth.service';

import { Category, SubCategory } from '../../providers/category';
import { Product } from '../../providers/product';

import { User, Votes } from '../../providers/user';

import { UploadFileService } from '../../providers/upload-file.service';
import { FileUpload } from '../../providers/fileupload';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {
  allCategories: Observable<Category[]>;
  allSubCategories: Observable<SubCategory[]>;

  id: number;
  currentProduct: Product;
  subCatId: number;
  catId: number;

  subCatName: string;
  catName: string;

  like: number;
  dislike: number;

  checkImg: boolean;
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = { percentage: 0 };
  file: string;

  currentUser: User;
  votes: Votes[];

  constructor(public pService: ProductService,
    public afService: AuthService,
    public cService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadFileService) { }

  ngOnInit() {
    this.afService.user$.subscribe(user => this.currentUser = user);
    this.afService.votes$.subscribe(v => this.votes = v);

    this.allCategories = this.cService.getAllCategories();
    this.allSubCategories = this.cService.getAllSubCategories();

    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.pService.getProduct(this.id).subscribe(product => {
        this.currentProduct = product;
        this.cService.getSubCategory(product.parentId).subscribe(subCat => {
          this.subCatId = subCat.uid;
          this.subCatName = subCat.name;
          this.cService.getCategory(subCat.parentId).subscribe(cat => {
            this.catId = cat.id;
            this.catName = cat.name;
          });
        });
      });
    });
  }

  updateProduct() {
    if(!this.currentProduct.deal)
      this.currentProduct.dprice = this.currentProduct.price;
    if(this.pService.checkFieldValidities(this.currentProduct.parentId, this.currentProduct.name, this.currentProduct.description, this.currentProduct.price, this.currentProduct.quantity, this.currentProduct.deal, this.currentProduct.dprice)) {
      if (this.selectedFiles == undefined) {
        this.pService.updateProduct(this.currentProduct.id, this.currentProduct.parentId, this.currentProduct.name.trim(), this.currentProduct.description.trim(), this.currentProduct.price, this.currentProduct.quantity, this.currentProduct.deal, this.currentProduct.dprice, this.currentProduct.fileUrl, this.currentProduct.isImage);
      }
      else {
        var file = this.selectedFiles.item(0);
        this.currentFileUpload = new FileUpload(file);
        if (this.currentProduct.deal == undefined)
          this.currentProduct.deal = false;

        this.uploadService.pushFileToStorageAndAddDocToDB(this.currentFileUpload, this.progress, this.currentProduct.parentId, this.currentProduct.id, this.currentProduct.name.trim(), this.currentProduct.description.trim(), this.currentProduct.price, this.currentProduct.quantity, this.currentProduct.deal, this.currentProduct.dprice, "updateProduct", this.checkImg);

        this.file = undefined;
        this.selectedFiles = undefined;
        this.unsetFileUpload();
      }
    }
  }
  
  selectFile(event) {
    const file = event.target.files.item(0);
    this.selectedFiles = event.target.files;
    
    if (file.type.match('image.*')) {
      this.checkImg = true;
    } else {
      this.checkImg = false;
    }
  }
  
  //ugly solution to reset preloader
  unsetFileUpload() {
    setTimeout(() => {
      this.currentFileUpload = undefined;
      // console.log("file unset");
    }, 3000);
  }

  deleteProduct() {
    if (confirm("Are you sure you want to delete this product?")) {
      this.pService.deleteProduct(this.id);
      window.history.back();
    }
  }

  addALike(id: number, l: number, dl: number) {
    if (this.currentUser) {
      const t = this.afService.whichVote(id, this.currentUser, this.votes);
      if (t > 0) {
        l = l - 2; //Vote was on like.
      }
      else if (t < 0) {
        dl = dl - 1; //If vote was on dislike we -1 so it dosen't get anything added.
      }

      if (l != null && dl != null) {
        this.pService.updateProductRating(this.id, l + 1, dl);
      }
      else if (l != null && dl == null) {
        this.pService.updateProductRating(this.id, l + 1, 0);
      }
      else if (l == null && dl != null) {
        this.pService.updateProductRating(this.id, 1, dl);
      }
      else {
        this.pService.updateProductRating(this.id, 1, 0);
      }
      if (t > 0) {
        this.afService.setVoteById2(id, this.currentUser, 0);
      }
      else {
        this.afService.setVoteById2(id, this.currentUser, 1);
      }
    }
  }
  addADislike(id: number, l: number, dl: number) {
    if (this.currentUser) {
      const t = this.afService.whichVote(id, this.currentUser, this.votes);
      if (t > 0) {
        l = l - 1; //Vote was on like.
      }
      else if (t < 0) {
        dl = dl - 2; //If vote was on dislike we -1 so it dosen't get anything added.
      }
      if (l != null && dl != null) {
        this.pService.updateProductRating(this.id, l, dl + 1);
      }
      else if (l != null && dl == null) {
        this.pService.updateProductRating(this.id, l, 1);
      }
      else if (l == null && dl != null) {
        this.pService.updateProductRating(this.id, 0, dl + 1);
      }
      else {
        this.pService.updateProductRating(this.id, 0, 1);
      }
      if (t < 0) {
        this.afService.setVoteById2(id, this.currentUser, 0);
      }
      else {
        this.afService.setVoteById2(id, this.currentUser, -1);
      }
    }
  }

  // returns a zero is the product has a null field
  getVote(vote: number) {
    if(vote)
      return vote;
    return 0;
  }

  unsetParentId() {
    this.currentProduct.parentId = undefined;
  }
  voted(id: number) {
    return this.afService.whichVote(id, this.currentUser, this.votes);
  }
}
