import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../../providers/category.service';
import { Observable } from 'rxjs/Observable';

import { Category, SubCategory } from '../../providers/category';

//Imports to use user.
import { AuthService } from '../../providers/auth.service';

import { User } from '../../providers/user';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  categories: Observable<Category[]>;
  catId: number;
  name: string;

  user: User;

  constructor(public cService: CategoryService,
              public afService: AuthService) { }

  ngOnInit() {
    this.afService.user$.subscribe(user => this.user = user);
    this.categories = this.cService.getAllCategories();
  }

  newSubCat() {
    this.cService.newSubCategory(this.catId, this.name);
    this.name = "";
  }

}
