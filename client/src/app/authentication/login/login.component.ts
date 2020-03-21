import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {UserService} from '../user.service';


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


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
    this.userService.validate(this.f.username.value, this.f.password.value).then((response) => {
      console.log(response);
      this.userService.setUserInfo({'user': response['user']});
      this.router.navigate(['feed']);
    })
  }

}
