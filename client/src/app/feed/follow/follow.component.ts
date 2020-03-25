import { Component, OnInit } from '@angular/core';
import {SocketService} from "../socket.service";
import {UserService} from '../../authentication/user.service';
import {Post} from "../feed.interfaces";
import {User} from '../../authentication/authentication.interfaces';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss'],
  providers: [SocketService]
})
export class FollowComponent implements OnInit {
  error = '';
  success = '';
  public users = [];
  public posts: Post[] = [];

  public user: User = {"id" : null, "password": "", "username": "", "follows": []};   

  constructor(private socket: SocketService, private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();  
    this.socket.posts$.subscribe(posts => this.posts = posts);
    this.filter();
    this.getUser(); 
  }

  follow(user: string){
    this.error = this.success = '';
    console.log("follow" + user);
    this.userService.follow(user)
      .then((res) => {
        console.log(res); 
        this.user = res['user'];
        console.log(res['user']);
        this.userService.setUserInfo({'user': this.user});
        console.log(this.userService.getUserInfo());
        this.success = 'followed';
        this.filter()})
      .catch((err) => {this.error = JSON.stringify(err['error']['message']).slice(1, -1); console.log(err)})
      
  }

  unfollow(user: string){
    this.error = this.success = '';
    this.userService.unfollow(user)
      .subscribe(data => {
        console.log(data); 
        this.user = data['user'];
        console.log(data['user']);
        this.userService.setUserInfo({'user': this.user});
        console.log(this.userService.getUserInfo());
        this.success='unfollowed successful';
        this.filter()})
  }


  getUsers(){
    this.userService.getUsers()
      .subscribe(data => {
        console.log(data[0]['username']);
        for (var i = 0; i < data.length; i++){
          this.users.push(data[i]['username']);
        }
      }, 
      error => {console.log(error); this.error = JSON.stringify(error['error']['message']).slice(1, -1);});
  }


  getUser(){
    this.userService.getUser()
      .subscribe(data => {
        this.user = data['user'];
        console.log(data['user']);
        this.userService.setUserInfo({'user': this.user});
      })
  }

  filter() {
    var type="users";
    var filter = JSON.parse(localStorage.getItem('userInfo')).follows;  
    this.socket.filter(filter.join(" "), type);
  }

}
