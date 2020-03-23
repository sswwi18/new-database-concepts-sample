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

    if(this.f.password.value !== this.f.password_validation.value){
      return this.error = 'passwords do not match'; 
    }
   

    this.loading = true;
   

    this.UserService.register(this.registerForm.value)
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['login']);
      }, 
      error => {
        console.log(error);
        this.loading = false;
        return this.error = 'username already taken'
      }
      )
     
      };
  
}
