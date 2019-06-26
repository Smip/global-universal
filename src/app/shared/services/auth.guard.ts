import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor (private authService: AuthService,
               private router: Router,
               @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (this.authService.isLoggedIn()) {
        return true;
      } else if (localStorage.getItem('token')) {
        this.authService.login();
        return true;
      } else {
        this.router.navigate(['/admin/auth'], {
          queryParams: {
            accessDenied: true
          }
        });
      }
    }
    return false;
  }
  
  canActivateChild (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }
  
}
