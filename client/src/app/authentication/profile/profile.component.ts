import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../authentication.interfaces';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User = {"id" : null, "password": "", "username": ""};
  constructor(private userService: UserService) { }

  ngOnInit() {
   let userInfo = JSON.parse(this.userService.getUserInfo());
    this.user.id = userInfo['id'];
    this.user.username = userInfo['username'];
  }




}
