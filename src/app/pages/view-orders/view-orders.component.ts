import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';

import { Observable } from 'rxjs/Observable';
import { User, Order } from '../../providers/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {

  orders: Order[];
  user: User;
  rowSpan: number;
  details: number;

  constructor(public afService: AuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => { this.details = +params['id']; });
    // console.log(this.user);
    this.afService.user$.subscribe(u => {
      this.user = u;
      this.afService.getAllOrders(u).subscribe(o => this.orders = o);
    });
  }
}
