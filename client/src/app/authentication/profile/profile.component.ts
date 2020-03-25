import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../authentication.interfaces';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User = {"id" : null, "password": "", "username": "", "follows": []};
  constructor(
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
   let userInfo = JSON.parse(this.userService.getUserInfo());
    this.user.id = userInfo['id'];
    this.user.username = userInfo['username'];
  }

  logout(){
    this.userService.logout(this.user);
    this.router.navigate(['login']);
  }


}
