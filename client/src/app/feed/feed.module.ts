import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FeedPageComponent} from './feed-page/feed-page.component';
import {RouterModule} from "@angular/router";
import {PostComponent} from './post/post.component';
import { LikeButtonComponent } from './like-button/like-button.component';
import { DislikeButtonComponent } from './dislike-button/dislike-button.component';

@NgModule({
  declarations: [FeedPageComponent, PostComponent, LikeButtonComponent, DislikeButtonComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: FeedPageComponent}
    ]),
  ]
})
export class FeedModule {
}
