import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findLang'
})
export class FindLangPipe implements PipeTransform {
  
  transform (value: any[], search: string): any {
    if (!search || !value.length) {
      return null;
    }
    const finded = value.find((elem) => elem.lang === search);
    if (finded === undefined) {
      const order = ['uk', 'ru', 'en'];
      const res = value.sort((first, second) => {
        return order.indexOf(first.lang) - order.indexOf(second.lang);
      });
      return res[0];
    } else {
      return finded;
    }
  }
  
}
