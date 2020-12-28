import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { HistoryComponent } from './pages/history/history.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment.prod';
import { ProfileComponent } from './pages/profile/profile.component';
import { BlogComponent } from './admin/blog/blog.component';
import { DrinksComponent } from './admin/drinks/drinks.component';
import { ProductsComponent } from './admin/products/products.component';
import { ProductComponent } from './pages/product/product.component';
import { ProdDetailsComponent } from './pages/prod-details/prod-details.component';
import { DiscountComponent } from './admin/discount/discount.component';
import { DrinkComponent } from './pages/drink/drink.component';
import { DrinkDetailsComponent } from './pages/drink-details/drink-details.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SearchPipe } from './shared/pipes/search.pipe';


import { ToastrModule } from 'ngx-toastr';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';



import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from "ngx-ui-loader";
import { ngxUiLoaderConfig } from './preloader-config';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuillModule } from 'ngx-quill';
import { ContactComponent } from './pages/contact/contact.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HistoryComponent,
    AdminComponent,
    ProfileComponent,
    BlogComponent,
    DrinksComponent,
    ProductsComponent,
    ProductComponent,
    ProdDetailsComponent,
    DiscountComponent,
    DrinkComponent,
    DrinkDetailsComponent,
    OrdersComponent,
    SearchPipe,
    BlogDetailsComponent,
    ContactComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    BrowserAnimationsModule,
    QuillModule.forRoot(),
    ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
