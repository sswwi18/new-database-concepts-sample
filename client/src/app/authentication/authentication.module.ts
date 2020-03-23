import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {HttpClientModule} from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent, ProfileComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule
  ], 
  exports: [LoginComponent, HttpClientModule]
})
export class AuthenticationModule { }
