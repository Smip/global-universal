import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BaseApi } from '../core/base-api';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class UsersService extends BaseApi {
  
  constructor (
    public http: HttpClient,
    public auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super(http);
  }
  
  login (data): Observable<any> {
    return this.post(`auth`, data)
      .map((res) => {
        if (isPlatformBrowser(this.platformId)) {
          if (res.token) {
            localStorage.setItem('token', res.token);
            this.auth.login();
            
            return true;
          }
        }
        return false;
      });
  }
  
  logout () {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.auth.logout();
  }
  
  getMe (): Observable<User> {
    return this.get(`user/me`)
      .map((user: User) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
      });
  }
  
}
