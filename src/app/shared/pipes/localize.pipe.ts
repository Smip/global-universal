import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const VIEW_DESTROYED_STATE = 128;

@Pipe({
  name: 'localize'
})
export class LocalizePipe implements PipeTransform {
  private value: string | any[] = '';
  private lastKey: string | any[];
  private lastLanguage: string;
  
  constructor (private translate: TranslateService) {
  }
  
  transform (query: string | any[], trigger: any): string | any[] {
    if (!query || query.length === 0 || !this.translate.currentLang) {
      return query;
    }
    if (query === this.lastKey && this.lastLanguage === this.translate.currentLang) {
      return this.value;
    }
    this.lastKey = query;
    this.lastLanguage = this.translate.currentLang;
    if (typeof query === 'string') {
      this.value = !query.indexOf('/') ? `/${this.translate.currentLang}${query}` : query;
    } else if (typeof query === 'object') {
      if (query.length > 1 && !query[0].indexOf('/')) {
        query.unshift(`/${this.translate.currentLang}`);
        this.value = query;
      } else if (query.length === 1 && query[0] === '/') {
        this.value = [`/${this.translate.currentLang}`];
      } else if (query.length === 1 && !query[0].indexOf('/')) {
        query.unshift(`/${this.translate.currentLang}`);
        this.value = query;
      } else {
        this.value = query;
      }
    }
    return this.value;
  }
  
}
