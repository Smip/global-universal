import { Component, OnDestroy, OnInit } from '@angular/core';
import { iif, of, throwError } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ArticleService } from '../../shared/services/article.service';
import { Article } from '../../shared/models/article.model';
import { concatMap, delay, retryWhen } from 'rxjs/internal/operators';
import { ActivatedRoute } from '@angular/router';

declare const M: any;

@Component({
  selector: 'global-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  subscription2: Subscription;
  isLoaded = false;
  articles: Article[];
  itemsOnPage = 10;
  currentPage: number;
  totalItems: number;
  
  constructor (private articleService: ArticleService,
               public translate: TranslateService,
               private route: ActivatedRoute) { }
  
  ngOnInit () {
    this.currentPage = +this.route.snapshot.params['page'] || 1;
    this.subscription2 = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.load_article(event.lang, this.currentPage);
    });
    this.load_article(this.translate.currentLang, this.currentPage);
  }
  
  ngOnDestroy () {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subscription2) { this.subscription2.unsubscribe(); }
  }
  
  goToPage (n: number): void {
    this.currentPage = n;
    this.load_article(this.translate.currentLang, this.currentPage);
  }
  
  onNext (): void {
    this.currentPage++;
    this.load_article(this.translate.currentLang, this.currentPage);
  }
  
  onPrev (): void {
    this.currentPage--;
    this.load_article(this.translate.currentLang, this.currentPage);
  }
  
  load_article (lang: string, page: number) {
    this.isLoaded = false;
    this.subscription = this.articleService.getArticles('news', page)
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
      .subscribe((res: any) => {
        this.articles = <Article[]>res.data;
        this.totalItems = res.total;
        this.isLoaded = true;
      });
  }
  
}
