import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {Post} from "./feed.interfaces";
import {Subject} from "rxjs";

@Injectable()
export class SocketService {
  public posts$: Subject<Post> = new Subject<Post>();
  private socket: SocketIOClient.Socket = io(environment.socketHost);

  constructor() {
    this.socket.on('post', (rawPost: string) => {
      this.posts$.next(JSON.parse(rawPost));
    });
  }

  public addPost(post: Post) {
    this.socket.emit('post', JSON.stringify(post));
  }

  public close(): void {
    this.socket.close();
    this.posts$.complete();
  }
}
