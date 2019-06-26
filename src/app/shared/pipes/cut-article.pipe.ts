import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutArticle'
})
export class CutArticlePipe implements PipeTransform {
  
  transform (value: string, max?: number): any {
    if (!value) {
      return null;
    }
    if (!max) {
      max = 300;
    }
    let text = value.replace(/(<([^>]+)>)/ig, ' ');
    text = text.length > max ? text.substring(0, max) + '...' : text;
    return text;
  }
  
}
