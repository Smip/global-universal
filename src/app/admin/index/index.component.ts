import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';
import { Article } from '../../shared/models/article.model';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { concatMap, delay, retryWhen } from 'rxjs/internal/operators';
import { iif, of, throwError } from 'rxjs';

declare const M: any;

@Component({
  selector: 'global-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  isLoaded = false;
  articles: Article[];
  
  constructor (
    private articleService: ArticleService,
    public translate: TranslateService
  ) { }
  
  ngOnInit () {
    this.subscription = this.articleService.getArticles()
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
      ).subscribe((articles: any) => {
        this.articles = <Article[]>articles.data;
        this.isLoaded = true;
      });
  }
  
  ngOnDestroy () {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
  
}
