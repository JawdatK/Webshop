import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { CategoryService } from '../../providers/category.service';
import { ProductService } from '../../providers/product.service';
import { AuthService } from '../../providers/auth.service';

import { Category, SubCategory } from '../../providers/category';
import { Product } from '../../providers/product';

import { User } from '../../providers/user';

@Component({
  selector: 'app-subcategory-overview',
  templateUrl: './subcategory-overview.component.html',
  styleUrls: ['./subcategory-overview.component.css']
})
export class SubcategoryOverviewComponent implements OnInit {
    id: number;

    currentSubCat: SubCategory;
    allProducts: Product[];
    paginatedProducts: Product[];
    currentCatName: string;

    currentPage: number;
    productsPerPage: number = 10;

    currentUser: User;

    constructor(public afs: AngularFirestore,
                public pService: ProductService,
                public afService: AuthService,
                public cService: CategoryService,
                private route: ActivatedRoute,) { }

    ngOnInit() {
      this.afService.user$.subscribe(user => this.currentUser = user);

      // Subscribes to id parameter
      this.route.params.subscribe(params => {
        this.id = +params['id'];

        this.cService.getSubCategory(this.id).subscribe(subCategory => {
          this.currentSubCat = subCategory;
          this.cService.getCategory(this.currentSubCat.parentId).subscribe(output => this.currentCatName = output.name);
        });

        this.pService.getProducts(this.id).subscribe(products => {
          this.allProducts = products;
          this.setPage(0);
        });

      });
    }

    prevPage() {
      this.setPage(this.currentPage - 1);
    }
    nextPage() {
      this.setPage(this.currentPage + 1);
    }

    setPage(page: number) {
      this.currentPage = page;
      var startIndex: number = this.productsPerPage * this.currentPage;
      console.log();
      this.paginatedProducts = new Array();
      for(var i: number = startIndex; i < startIndex + this.productsPerPage; i ++) {
        if(i < this.allProducts.length)
          this.paginatedProducts.push(this.allProducts[i]);
      }

    }

    noMorePagesExists() {
      return this.productsPerPage * (this.currentPage + 1) >= this.allProducts.length
    }

}
