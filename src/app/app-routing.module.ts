import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BlogComponent } from './admin/blog/blog.component';
import { DiscountComponent } from './admin/discount/discount.component';
import { DrinksComponent } from './admin/drinks/drinks.component';
import { ProductsComponent } from './admin/products/products.component';
import { AdminGuard } from './guards/admin.guard';
import { ProfileGuard } from './guards/profile.guard';
import { DrinkDetailsComponent } from './pages/drink-details/drink-details.component';
import { DrinkComponent } from './pages/drink/drink.component';
import { HistoryComponent } from './pages/history/history.component';
import { HomeComponent } from './pages/home/home.component';
import { ProdDetailsComponent } from './pages/prod-details/prod-details.component';
import { ProductComponent } from './pages/product/product.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent},
  { path: 'product', component: ProductComponent},
  { path: 'product/:id', component: ProdDetailsComponent }, 
  { path: 'drink', component: DrinkComponent},
  { path: 'drink/:name', component: DrinkDetailsComponent }, 
  { path: 'history', component: HistoryComponent},
  
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard],  children: [
    { path: '', pathMatch: 'full', redirectTo: 'drinks' },
    { path: 'drinks', component: DrinksComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'adminBlogs', component: BlogComponent },
    { path: 'discount', component: DiscountComponent }
  ] },  
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard]},
  { path: '**', component: HomeComponent },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
