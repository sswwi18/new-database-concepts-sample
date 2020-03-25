import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';
import {User} from './authentication.interfaces';
import {Observable} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserService {

    message: any;
    loggedInUserInfo : {};
    headers = new HttpHeaders()
    constructor(private http: HttpClient)  { 
        this.headers.append('Content-Type', 'application/json');
    }

   

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
        user["follows"] = [];        
        console.log(user);
        return this.http.post<any>('/api/users/register', user, {headers: this.headers});
        };


    public validate(username, password) : Observable<User>{
        return this.http.post<User>('/api/authenticate', {'username' : username, 'password' : password});
    }

    public follow(user: string){
        return this.http.post('/api/follow', {user}, {headers: this.headers}).toPromise();
      }

    public unfollow(user: string) : Observable<any>{
        return this.http.post('api/unfollow', {user}, {headers: this.headers});
    }

    
    public getUsers() : Observable<string>{
        return this.http.get<string>('/api/users', {headers: this.headers});
    }

    public getUser() : Observable<any>{
        return this.http.get<string>('/api/user', {headers: this.headers});
    }

}