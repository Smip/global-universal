import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../core/base-api';

@Injectable()
export class TarifsService extends BaseApi {
  
  constructor (
    public http: HttpClient
  ) {
    super(http);
  }
  
  getTarifs (search: string = 'ukraine'): Observable<any> {
    return this.get(`tarifs/` + search);
  }
  
  postTarifs (data): Observable<any> {
    return this.post('tarifs', data);
  }
  
}
