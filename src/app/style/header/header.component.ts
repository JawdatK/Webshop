import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../providers/auth.service';
// import { CategoryService } from '../../providers/category.service';
// import { ProductService } from '../../providers/product.service';
import { Observable } from 'rxjs/Observable';

import { User, Basket } from '../../providers/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../app.component.css']
})
export class HeaderComponent implements OnInit {
  user: User;
  basket: Basket[];
  nrOfItems: number;

  constructor(public afService: AuthService,
    // public cgService: CategoryService,
    // public pService: ProductService,
  ) { }

  ngOnInit() {
    this.afService.user$.subscribe(user => {
      this.user = user;
      if(user) {
        this.afService.basket$.subscribe(basket => {
          this.basket = basket;
          this.nrOfItems = 0;
          for (let item of basket) {
            this.nrOfItems += item.quantity;
          }
        });
      }
    });
  }

  help()
  {
    alert("Under construction");
  }

}
