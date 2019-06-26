import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export class AuthService {
  
  private isAuthenticated = false;
  
  constructor (@Inject(PLATFORM_ID) private platformId: Object) { }
  
  login () {
    this.isAuthenticated = true;
  }
  
  logout () {
    this.isAuthenticated = false;
  }
  
  isLoggedIn (): boolean {
    if (this.isAuthenticated) {
      return this.isAuthenticated;
    } else {
      if (isPlatformBrowser(this.platformId)) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
          this.login();
        }
      }
      return this.isAuthenticated;
    }
    
  }
}
