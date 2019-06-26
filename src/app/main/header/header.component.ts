import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'global-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  constructor (
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) { }
  
  ngOnInit () {
  }
  
  changeLang (lang: string = '') {
    const urlSegments = this.router.url.split('/');
    if (urlSegments.length > 1) {
      urlSegments[1] = lang;
      this.router.navigate(urlSegments);
    }
    this.translate.use(lang);
  }
}
