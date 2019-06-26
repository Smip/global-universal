import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  
  transform (value: string, formatFrom: string, formatTo: string = 'DD.MM.YYYY'): string {
    return moment.utc(value).local().format(formatTo);
  }
  
}
