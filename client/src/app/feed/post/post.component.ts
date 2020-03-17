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

  hashtag(item){
    console.log(item);
    console.log("hashtag");
    console.log(item["post"]);
    var post = JSON.parse(JSON.stringify(item["post"]));
    var id = (post["id"]);
    //var link = "localhost:4200/hashtag?filter=" + document.getElementById(id).getAttribute("href").slice(1);  
    var filter = document.getElementById(id).getAttribute("href").slice(1)
    console.log("filter: " + filter);
    this.socket.filter(filter);
  }


}
