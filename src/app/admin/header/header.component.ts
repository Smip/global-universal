import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'global-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;
  
  constructor (
    private router: Router,
    private userService: UsersService,
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  
  ngOnInit () {
    if (isPlatformBrowser(this.platformId)) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }
  
  changeLang (lang: string = '') {
    this.translate.use(lang);
  }
  
  logOut () {
    this.userService.logout();
    this.router.navigate(['/']);
  }
  
}
