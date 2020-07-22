import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ListingComponent } from './components/listing/listing.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoutingGuardGuard } from './services/routing-guard.guard';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AddListingComponent } from './components/add-listing/add-listing.component';
import { MyExtensionsComponent } from './components/my-extensions/my-extensions.component';
import { EditListingComponent } from './components/edit-listing/edit-listing.component';
import { ViewUserComponent } from './components/view-user/view-user.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:key', component: ResetPasswordComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'browse/extensions', component: CategoryListComponent },
  { path: 'extension-detail', component: ListingComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [RoutingGuardGuard] },
  { path: 'view-user/:path', component: ViewUserComponent, canActivate: [RoutingGuardGuard] },
	{ path: 'profile', component: EditProfileComponent, canActivate: [RoutingGuardGuard] },
	{ path: 'change-password', component: ChangePasswordComponent, canActivate: [RoutingGuardGuard] },
	{ path: 'add-listing', component: AddListingComponent, canActivate: [RoutingGuardGuard] },
	{ path: 'my-extension', component: MyExtensionsComponent, canActivate: [RoutingGuardGuard] },
  { path: 'edit-listing', component: EditListingComponent, canActivate: [RoutingGuardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
