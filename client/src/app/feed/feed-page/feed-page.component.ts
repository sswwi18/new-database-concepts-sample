import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../feed.interfaces";
import {SocketService} from "../socket.service";
import { v4 as uuid } from 'uuid';
import {User} from '../../authentication/authentication.interfaces';

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

    var id=uuid();

    var words = content.split(" ");
    var hashtags = [];
    var user = JSON.parse(localStorage.getItem('userInfo'));

    for (var i = 0; i < words.length; i++) {
      if(words[i][0] == "#"){
        hashtags.push(words[i]);
      }
      }
    
      console.log(hashtags);

    this.socket.addPost({content: words, image: false, id:id, hashtags,  like:0, dislike:0, user: user.username});
  }

  addImage(event){
    console.log('addImage');
    console.log(event);
    var hashtags = [];
    var user = JSON.parse(localStorage.getItem('userInfo'));
    var id = uuid();
    var file = event.currentTarget.files[0];
    console.log(file);
    var reader = new FileReader();
    reader.onload = (e) => {
      var content = reader.result as string;
      var url = [];
      url.push(content);
      this.socket.addImage({content: url, image: true, hashtags, id: id ,like: 0, dislike: 0,user: user.username});
    }
    reader.readAsDataURL(file);
    };
}


