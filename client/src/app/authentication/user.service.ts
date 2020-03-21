import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';

import {User} from './authentication.interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {

    loggedInUserInfo : {};
    constructor(private http: HttpClient) { }

   

    public isAuthenticated(): Boolean {
        let userData = localStorage.getItem('userInfo')
        if(userData && JSON.parse(userData)){
            return true;
        }
        return false;
    }

    public setUserInfo(user){
        localStorage.setItem('userInfo', JSON.stringify(user));
    }

    register(user: User) {
        delete user["password_validation"];
        
        console.log("user: "+JSON.stringify(user));
        
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json');
        return this.http.post('/api/users/register', JSON.stringify(user), {
            headers: headers}).toPromise() 
        };


    public validate(username, password){
        return this.http.post('/api/authenticate', {'username' : username, 'password' : password}).toPromise()
    }



}