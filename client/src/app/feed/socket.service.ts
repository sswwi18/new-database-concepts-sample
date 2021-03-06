import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {Post} from "./feed.interfaces";
import {BehaviorSubject} from "rxjs";


@Injectable()
export class SocketService {
  public posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  private socket: SocketIOClient.Socket = io(environment.socketHost);


  //constructor Server
  constructor() {
    this.socket.on('post', (rawPost: string) => {
      const posts = this.posts$.getValue();
      posts.unshift(JSON.parse(rawPost));
      this.posts$.next(posts);
    });

    this.socket.on('image', (rawImage: string) => {
      const posts = this.posts$.getValue();
      posts.unshift(JSON.parse(rawImage));
      this.posts$.next(posts);
    });

    this.socket.on('like', (rawPost: string, position: number) => {
     const posts = this.posts$.getValue();
     posts.reverse().splice(position,1, JSON.parse(rawPost));
    this.posts$.next(posts.reverse());
    });

    this.socket.on('dislike', (rawPost: string, position: number) => {
      const posts = this.posts$.getValue();
      posts.reverse().splice(position,1, JSON.parse(rawPost));
     this.posts$.next(posts.reverse()); 
     });

    this.socket.on('previous posts', (rawPosts: string) => {
      const posts: Post[] = JSON.parse(rawPosts);

      // Reverse the posts to have the correct chronological order (new -> old)
      this.posts$.next(posts.reverse());
    });

    this.socket.on('filtered posts', (rawPosts: string) => {
      const posts: Post[] = JSON.parse(rawPosts);

      // Reverse the posts to have the correct chronological order (new -> old)
      this.posts$.next(posts.reverse());
    });    


  }

  public addPost(post: Post) {
    console.log('post');
    this.socket.emit('post', JSON.stringify(post));
  }

  public addImage(image: Post){
    console.log('addImage-socket' + image);
    this.socket.emit('image', image);
  }

  public close(): void {
    this.socket.close();
    this.posts$.complete();
  }

  public addLike (post: Post) {
    this.socket.emit('like', JSON.stringify(post));
  }

  public addDislike (post: Post) {
    this.socket.emit('dislike', JSON.stringify(post));
  }

  public filter(filter: string, type: string){ 
    this.socket.emit('filter', filter, type);
  }

}
