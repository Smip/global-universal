import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Article } from '../../shared/models/article.model';
import { iif, of, Subscription, throwError } from 'rxjs';
import { Content } from '../../shared/models/content.model';
import { concatMap, delay, retryWhen } from 'rxjs/internal/operators';

declare const M: any;

@Component({
  selector: 'global-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  subscription2: Subscription;
  isLoaded = false;
  content: Content;
  
  constructor (private articleService: ArticleService,
               private translate: TranslateService) { }
  
  ngOnInit () {
    this.subscription2 = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.load_article(event.lang);
    });
    this.load_article(this.translate.currentLang);
  }
  
  ngOnDestroy () {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subscription2) { this.subscription2.unsubscribe(); }
  }
  
  load_article (lang: string) {
    this.subscription = this.articleService.getArticle('public-offer', lang)
      .pipe(
        retryWhen(errors => errors.pipe(
          // Use concat map to keep the errors in order and make sure they
          // aren't executed in parallel
          concatMap((e, i) => {
              M.toast({html: 'Ошибка ' + e.status + '. Повторная попытка загрузки через 3 секунды.'});
              // Executes a conditional Observable depending on the result
              // of the first argument
              return iif(
                () => i > 100,
                // If the condition is true we throw the error (the last error)
                throwError(e),
                // Otherwise we pipe this back into our stream and delay the retry
                of(e).pipe(delay(3000))
              );
            }
          )
          )
        )
      )
      .subscribe((article: Article) => {
        this.content = article.contents[0];
        this.isLoaded = true;
      });
  }
  
}
