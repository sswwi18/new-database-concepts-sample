import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';
import {User} from './authentication.interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

    message: any;
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
        localStorage.setItem('userInfo', JSON.stringify(user['user']));
    }

    public getUserInfo(){
        return localStorage.getItem('userInfo');
    }

    public logout(user: User){
        localStorage.removeItem('userInfo');
        return this.http.post('/api/logout', user); 
    }

    register(user: User) : Observable<any> {
        delete user["password_validation"];
                
        
        return this.http.post<any>('/api/users/register', JSON.stringify(user));
        };


    public validate(username, password) : Observable<User>{
        return this.http.post<User>('/api/authenticate', {'username' : username, 'password' : password});
    }
}