import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import {UserService} from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService : UserService, private route : Router) { }

  canActivate(){
    if(this.authService.isAuthenticated()){
      return true;
    }
    this.route.navigate(['login']);
    return false;
  }
}	