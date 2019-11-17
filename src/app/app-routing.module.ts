import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";

// pages
import { AddCategoryComponent } from './adminfunctions/add-category/add-category.component';
import { AddProductComponent } from './adminfunctions/add-product/add-product.component';
import { SubcategoryOverviewComponent } from './pages/subcategory-overview/subcategory-overview.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SearchOverviewComponent } from './pages/search-overview/search-overview.component';
import { ShoppingBasketComponent } from './pages/shopping-basket/shopping-basket.component';
import { HomepageComponent} from './pages/homepage/homepage.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ViewOrdersComponent } from './pages/view-orders/view-orders.component';

//Routes Array
const routes : Routes = [
    { // Start page 
      path:"",
      redirectTo: "/homepage",
      pathMatch: "full" 
    },
    {
      path:"homepage",
      component:HomepageComponent
    },
    {
      path:"view-orders",
      component:ViewOrdersComponent
    },
    {
      path:"view-orders/:id",
      component:ViewOrdersComponent
    },
    {
      path:"addcategory",
      component:AddCategoryComponent
    },
    {
      path:"addproduct",
      component:AddProductComponent
    },
    {
      path:"subcategory-overview/:id",
      component:SubcategoryOverviewComponent
    },
    {
      path:"product-details/:id",
      component:ProductDetailsComponent
    },
    {
      path:"search/:text",
      component:SearchOverviewComponent
    },
    {
      path:"shopping-basket",
      component:ShoppingBasketComponent
    },
    {
      path:"view-orders",
      component:ViewOrdersComponent
    },
    {
      path:"profile-page",
      component:ProfilePageComponent
    }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
 export class AppRoutingModule {}
