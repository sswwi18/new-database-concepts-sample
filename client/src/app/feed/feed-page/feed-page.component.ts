import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../feed.interfaces";
import {SocketService} from "../socket.service";

@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss'],
  providers: [SocketService]
})
export class FeedPageComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];

  constructor(private socket: SocketService) {
  }

  ngOnInit(): void {
    this.socket.posts$.subscribe(posts => this.posts = posts);
  }

  ngOnDestroy(): void {
    this.socket.close();
  }

  addPost(content: string) {
    this.socket.addPost({content});
  }
}
