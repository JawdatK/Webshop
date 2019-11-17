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
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  id: number;

  currentSubCat: SubCategory;
  paginatedProducts: Product[];
  currentCatName: string;
  allProducts: Product[];

  dealProducts: Product[];
  nonDealProducts: Product[];

  currentPage: number;
  productsPerPage: number = 10;

  currentUser: User;

  constructor(public afs: AngularFirestore,
    public pService: ProductService,
    public afService: AuthService,
    public cService: CategoryService,
    private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.afService.user$.subscribe(user => this.currentUser = user);
    
    this.pService.getAllDeals().subscribe(products => {
      this.dealProducts = new Array();
      for(let product of products) {
        if(product.quantity > 0)
          this.dealProducts.push(product);
      }
    });

    this.pService.getAllNonDeals().subscribe(products => {
      this.nonDealProducts = products;
      // this.nonDealProducts.sort((n1, n2) => n1.id - n2.id); // sort by id attempt
      this.setPage(0);
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
    for (var i: number = startIndex; i < startIndex + this.productsPerPage; i++) {
      if (i < this.nonDealProducts.length)
        this.paginatedProducts.push(this.nonDealProducts[i]);
    }

  }

  noMorePagesExists() {
    return this.productsPerPage * (this.currentPage + 1) >= this.nonDealProducts.length
  }


}
