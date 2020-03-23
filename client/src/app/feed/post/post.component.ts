import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Post} from "../feed.interfaces";
import {SocketService} from "../socket.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [SocketService]
})
export class PostComponent implements OnInit {
  @Input() public post: Post | null = null;

  constructor(private socket: SocketService) {
  }

  ngOnInit() {
  }

}
