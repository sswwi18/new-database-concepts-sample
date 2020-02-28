import { Component, OnInit, Input } from '@angular/core';
import {SocketService} from "../socket.service";
import {Post} from "../feed.interfaces";

@Component({
  selector: 'app-dislike-button',
  templateUrl: './dislike-button.component.html',
  styleUrls: ['./dislike-button.component.scss']
})
export class DislikeButtonComponent implements OnInit {

  @Input() public post: Post | null = null;

  public dislike = 0;

  constructor(private socket: SocketService) {
  }

  ngOnInit() {

  }

  addDislike(){
    this.post.dislike += 1;
    this.socket.addDislike(this.post);
  }
  
}
