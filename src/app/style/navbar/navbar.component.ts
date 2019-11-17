import { Component, OnInit } from '@angular/core';

import {CategoryService} from '../../providers/category.service';
import { Observable } from 'rxjs/Observable';


import { Category, SubCategory } from '../../providers/category';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['../../app.component.css']
})
export class NavbarComponent implements OnInit {
  categories: Category[];
  subCategories: SubCategory[];
  constructor(public cService: CategoryService,) { }

  ngOnInit() {
    this.cService.categories.subscribe(categories => this.categories = categories);
    this.cService.subCategories.subscribe(subCategories => this.subCategories = subCategories);
  }
  
}
