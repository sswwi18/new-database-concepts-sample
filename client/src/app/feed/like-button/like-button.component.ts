import { Component, OnInit, Input } from '@angular/core';
import {SocketService} from "../socket.service";
import {Post} from "../feed.interfaces";

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss'],
  providers: [SocketService]
})


export class LikeButtonComponent implements OnInit {

  @Input() public post: Post | null = null;

  public like = 0;

  constructor(private socket: SocketService) {
  }

  ngOnInit() {

  }

  addLike(){
    this.post.like += 1;
    this.socket.addLike(this.post);
  }

}
