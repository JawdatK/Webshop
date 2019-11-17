import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//forms
import { FormsModule }   from '@angular/forms';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';

//auth
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';


//Services
import { AuthService } from './providers/auth.service';
import { CategoryService } from './providers/category.service';
import { GlobalService } from './providers/global.service';
import { ProductService } from './providers/product.service';
import { UploadFileService } from './providers/upload-file.service';

import { AppComponent } from './app.component';

// style
import { HeaderComponent } from './style/header/header.component';
import { SearchComponent } from './style/search/search.component';
import { NavbarComponent } from './style/navbar/navbar.component';
import { FooterComponent } from './style/footer/footer.component';

// routes
import { AppRoutingModule } from './app-routing.module';

import { AddCategoryComponent } from './adminfunctions/add-category/add-category.component';
import { AddProductComponent } from './adminfunctions/add-product/add-product.component';

import { SubcategoryOverviewComponent } from './pages/subcategory-overview/subcategory-overview.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SearchOverviewComponent } from './pages/search-overview/search-overview.component';
import { ShoppingBasketComponent } from './pages/shopping-basket/shopping-basket.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ViewOrdersComponent } from './pages/view-orders/view-orders.component';


@NgModule({
  declarations: [
    AppComponent,
    AddCategoryComponent,
    HeaderComponent,
    SearchComponent,
    NavbarComponent,
    FooterComponent,
    AddProductComponent,
    SubcategoryOverviewComponent,
    ProductDetailsComponent,
    SearchOverviewComponent,
    ShoppingBasketComponent,
    HomepageComponent,
    ProfilePageComponent,
    ViewOrdersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule
  ],
  providers: [
    AuthService,
    CategoryService,
    GlobalService,
    ProductService,
    UploadFileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
