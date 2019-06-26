import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BaseApi {
  private baseUrl = 'http://global.ua/api/';
  
  constructor (public http: HttpClient) {
  }
  
  public get (url: string = ''): Observable<any> {
    return this.http.get(this.getUrl(url));
  }
  
  public post (url: string = '', data: any = {}): Observable<any> {
    return this.http.post(this.getUrl(url), data);
  }
  
  public put (url: string = '', data: any = {}): Observable<any> {
    return this.http.put(this.getUrl(url), data);
  }
  
  public delete (url: string = ''): Observable<any> {
    return this.http.delete(this.getUrl(url));
  }
  
  private getUrl (url: string = ''): string {
    return this.baseUrl + url;
  }
}
