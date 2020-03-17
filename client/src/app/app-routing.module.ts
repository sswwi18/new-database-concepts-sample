import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FilterFeedComponent} from './feed/filter-feed/filter-feed.component';

const routes: Routes = [
  {path: '', redirectTo: '/feed', pathMatch: 'full'},
  {path: 'feed', loadChildren: () => import('./feed/feed.module').then(r => r.FeedModule)},
  {path: 'hashtag', component: FilterFeedComponent},
  {path: 'hashtag/:filter', component: FilterFeedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
