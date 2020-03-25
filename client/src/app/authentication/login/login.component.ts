import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../authentication.interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false; 
  submitted = false;
  returnUrl: string; 
  error = '';
    
  public user: User = {"id" : null, "password": "", "username": "", "follows": []};   


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {return this.loginForm.controls;}

  login(){
    if (this.loginForm.invalid){
      return;
    }
    this.userService.validate(this.f.username.value, this.f.password.value)
      .subscribe(data => {
        this.user = data['user'];
        console.log(this.user);
        this.userService.setUserInfo({'user': this.user});
        this.router.navigate(['feed'])},
        error => this.error = JSON.stringify(error['error']['message']).slice(1, -1));
  }

}
