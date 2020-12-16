import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BlogComponent } from './admin/blog/blog.component';
import { DrinksComponent } from './admin/drinks/drinks.component';
import { ProductsComponent } from './admin/products/products.component';
import { AdminGuard } from './guards/admin.guard';
import { ProfileGuard } from './guards/profile.guard';
import { HistoryComponent } from './pages/history/history.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'history', component: HistoryComponent},
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard],  children: [
    { path: '', pathMatch: 'full', redirectTo: 'drinks' },
    { path: 'drinks', component: DrinksComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'adminBlogs', component: BlogComponent }
  ] },  
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard]},
  { path: '**', component: HomeComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
