import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '../../providers/product';
import { ProductService } from '../../providers/product.service';
import { User } from '../../providers/user';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-search-overview',
  templateUrl: './search-overview.component.html',
  styleUrls: ['./search-overview.component.css']
})
export class SearchOverviewComponent implements OnInit {

  products: Product[];
  results: Product[];
  filteredResult: Product[];
  searchText: string;

  currentPage: number = 0;
  paginatedProducts: Product[];
  productsPerPage: number = 10;

  sliderValue: number = 0;

  currentUser: User;

  constructor(public pService: ProductService,
              private route: ActivatedRoute,
              public afService: AuthService) {
  }

  ngOnInit() {
    this.afService.user$.subscribe(user => this.currentUser = user);

    this.pService.getAllProducts().subscribe(ref => {
      this.products = ref;
      this.route.params.subscribe(params => {
        this.searchText = params['text'];
        this.filterProductsByText(this.searchText);

        this.filterProductsByRate(this.sliderValue);
        this.setPage(this.currentPage);
      });
    });
  }

  filterProductsByText(text: string) {
    var temp: Product[] = new Array();
    this.results = new Array();
    if (this.products) {
      for (let p of this.products) {
        if (p.name || p.description) {
          if (p.name.toLowerCase().search(text.toLowerCase()) != -1 || p.description.toLowerCase().search(text.toLowerCase()) != -1) {
            this.results.push(p);
          }
        }
      }
    }
  }

  // Pagination functions. Copied from subcategory-overview
  prevPage() {
    this.setPage(this.currentPage - 1);
  }
  nextPage() {
    this.setPage(this.currentPage + 1);
  }

  setPage(page: number) {
    this.currentPage = page;
    var startIndex: number = this.productsPerPage * this.currentPage;
    while(startIndex > this.filteredResult.length - 1) {
      this.currentPage --;
      startIndex -= this.productsPerPage;
    }
    this.paginatedProducts = new Array();
    for(var i: number = startIndex; i < startIndex + this.productsPerPage; i ++) {
      if(i < this.filteredResult.length)
        this.paginatedProducts.push(this.filteredResult[i]);
    }
  }

  noMorePagesExists() {
    return this.productsPerPage * (this.currentPage + 1) >= this.filteredResult.length;
  }

  filterProductsByRate(ratio: number){
    var tempArr: Product[] = new Array();
    for (let p of this.results){
      if (100 * (p.like / (p.like + p.dislike)) >= ratio){
       tempArr.push(p);
      }
    }
    this.filteredResult = tempArr;
    }

    getProductRating(product: Product) {
      var ratio = 100 * (product.like / (product.like + product.dislike));
      return Math.round(ratio);
    }
}
