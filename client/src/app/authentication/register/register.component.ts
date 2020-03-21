import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {UserService} from '../user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false; 
  submitted = false;
  returnUrl: string; 
  error = '';


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private UserService: UserService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password_validation: ['', Validators.required]
    });
  }

  get f() {return this.registerForm.controls;}

  register(){
    if (this.registerForm.invalid){
      return;
    }

    this.loading = true;
    console.log(this.f.username.value);
    console.log(this.f.password.value);
    console.log(this.f.password_validation.value);

    this.UserService.register(this.registerForm.value).then((response) => {
      console.log(response);
      this.router.navigate(['login']);
    })
    
  };

}
