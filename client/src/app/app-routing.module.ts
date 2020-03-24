import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FilterFeedComponent} from './feed/filter-feed/filter-feed.component';
import {LoginComponent} from './authentication/login/login.component';
import {RegisterComponent} from './authentication/register/register.component';
import {ProfileComponent} from './authentication/profile/profile.component';
import {AuthGuardService as AuthGuard, AuthGuardService} from './authentication/auth-guard.service' 



const routes: Routes = [
  {path: '', redirectTo: '/feed', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'feed', loadChildren: () => import('./feed/feed.module').then(r => r.FeedModule), canActivate: [AuthGuard]},
  {path: 'hashtag', component: FilterFeedComponent, canActivate: [AuthGuard]},
  {path: 'hashtag/:filter', component: FilterFeedComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'users/:filter', component: FilterFeedComponent, canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
