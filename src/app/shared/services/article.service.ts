import { Injectable } from '@angular/core';
import { BaseApi } from '../core/base-api';
import { HttpClient } from '@angular/common/http';
// import {Observable} from 'rxjs/Observable';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { Content } from '../models/content.model';

@Injectable()
export class ArticleService extends BaseApi {
  
  constructor (
    public http: HttpClient
  ) {
    super(http);
  }
  
  getArticles (categogy = '', page = 1): Observable<any> {
    if (categogy) {
      return this.get(`articles/${categogy}/${page}`);
    } else {
      return this.get(`articles/`);
    }
  }
  
  getArticle (slug: string, lang: string): Observable<Article> {
    return this.get(`article/` + slug + '/' + lang);
  }
  
  createArticle (category: string, content: Content): Observable<Article> {
    return this.post(`articles/${category}`, content);
  }
  
  deleteArticle (slug: string): Observable<any> {
    return this.delete(`article/` + slug);
  }
  
  createContent (slug: string, content: Content): Observable<Content> {
    return this.post(`article/` + slug, content);
  }
  
  updateContent (id: number, content: Content): Observable<Content> {
    return this.put(`content/` + id, content);
  }
  
}
