import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Article } from '../../shared/models/article.model';
import { ArticleService } from '../../shared/services/article.service';
import { TranslateService } from '@ngx-translate/core';
import { concatMap, delay, retryWhen } from 'rxjs/internal/operators';
import { iif, of, throwError } from 'rxjs';

declare const M: any;

@Component({
  selector: 'global-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  subscription2: Subscription;
  isLoaded = false;
  articles: Article[];
  toDelete: Article;
  itemsOnPage = 10;
  currentPage = 1;
  totalItems: number;
  
  constructor (
    private articleService: ArticleService,
    public translate: TranslateService
  ) { }
  
  ngOnDestroy () {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subscription2) { this.subscription2.unsubscribe(); }
  }
  
  goToPage (n: number): void {
    this.currentPage = n;
    this.load_article(this.currentPage);
  }
  
  onNext (): void {
    this.currentPage++;
    this.load_article(this.currentPage);
  }
  
  onPrev (): void {
    this.currentPage--;
    this.load_article(this.currentPage);
  }
  
  ngOnInit () {
    this.load_article(this.currentPage);
  }
  
  load_article (page: number) {
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
      ).subscribe((res: any) => {
        this.articles = <Article[]>res.data;
        this.totalItems = res.total;
        this.isLoaded = true;
      });
  }
  
  onDelete (article) {
    this.toDelete = article;
  }
  
  confirmDelete (article) {
    this.subscription2 = this.articleService.deleteArticle(article.slug)
      .subscribe((data) => {
        this.articles = this.articles.filter((a) => {
          return a.id !== article.id;
        });
        M.toast({html: 'Удалено'});
      });
  }
  
}
