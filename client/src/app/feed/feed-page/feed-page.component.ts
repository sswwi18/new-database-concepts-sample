import {Component, OnInit} from '@angular/core';
import {Post} from "../feed.interfaces";

@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss']
})
export class FeedPageComponent implements OnInit {
  public posts: Post[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  addPost(content: string) {
    this.posts.push({content});
  }
}
