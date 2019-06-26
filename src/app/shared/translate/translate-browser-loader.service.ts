import { HttpClient } from '@angular/common/http';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';

import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

const PREFIX = 'i18n';
const SUFFIX = '.json';

export class TranslateBrowserLoaderService implements TranslateLoader {
  constructor (private _prefix: string = PREFIX,
               private _suffix: string = SUFFIX,
               private _transferState: TransferState,
               private _http: HttpClient) {
  }
  
  public getTranslation (lang: string): Observable<any> {
    const key: StateKey<number> = makeStateKey<number>(`transfer-translate-${lang}`);
    const data: any = this._transferState.get(key, null);
    if (data) {
      return Observable.create(observer => {
        observer.next(data);
        observer.complete();
      });
    }
    return new TranslateHttpLoader(this._http, this._prefix, this._suffix).getTranslation(lang);
  }
}
