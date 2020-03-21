import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FilterFeedComponent} from './feed/filter-feed/filter-feed.component';
import {LoginComponent} from './authentication/login/login.component';
import {RegisterComponent} from './authentication/register/register.component';
import {ProfileComponent} from './authentication/profile/profile.component';
import {AuthGuardService as AuthGuard} from './authentication/auth-guard.service' 



const routes: Routes = [
  {path: '', redirectTo: '/feed', pathMatch: 'full'},
  {path: 'feed', loadChildren: () => import('./feed/feed.module').then(r => r.FeedModule), canActivate: [AuthGuard]},
  {path: 'hashtag', component: FilterFeedComponent},
  {path: 'hashtag/:filter', component: FilterFeedComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
