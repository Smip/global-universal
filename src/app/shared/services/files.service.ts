import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseApi } from '../core/base-api';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FilesService extends BaseApi {
  
  constructor (public http: HttpClient) {
    super(http);
  }
  
  addFile (data: FormData): Observable<any> {
    return this.post('file', data);
  }
  
  addFileFromLink (link: string): Observable<any> {
    return this.post('file/url', {file: link});
  }
  
}
