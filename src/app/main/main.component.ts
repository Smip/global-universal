import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'global-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  
  constructor (private route: ActivatedRoute,
               private router: Router,
               private translate: TranslateService) {}
  
  ngOnInit () {
    this.translate.addLangs(['en', 'ru', 'uk']);
    this.translate.setDefaultLang('uk');
    const currentLang = this.route.snapshot.params['lang'];
    if (['en', 'ru', 'uk'].includes(currentLang)) {
      this.translate.use(currentLang);
    } else {
      const browserLang = this.translate.getBrowserLang();
      const lang = browserLang ? browserLang : 'uk';
      this.translate.use(lang);
      this.router.navigate(['/', lang]);
    }
  }
  
}
