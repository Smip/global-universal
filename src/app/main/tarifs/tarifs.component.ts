import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TarifsService } from '../../shared/services/tarifs.service';
import { Subscription } from 'rxjs/Subscription';
import { concatMap, debounceTime, delay, distinct, pluck, retryWhen } from 'rxjs/internal/operators';
import { fromEvent, iif, of, throwError } from 'rxjs';
import { Tarif } from '../../shared/models/tarif.model';

declare const M: any;

@Component({
  selector: 'global-tarifs',
  templateUrl: './tarifs.component.html',
  styleUrls: ['./tarifs.component.scss']
})
export class TarifsComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription;
  subscription2: Subscription;
  tarifs: Tarif[];
  search: string;
  isLoaded = false;
  
  @ViewChild('searchInput') searchInput: ElementRef;
  
  constructor (private tarifsService: TarifsService) { }
  
  ngOnInit () {
    this.load_tarifs(undefined);
  }
  
  ngAfterViewInit () {
    this.subscription2 = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        pluck('target', 'value'),
        distinct(),
      )
      .subscribe(search => {
        this.load_tarifs(search || undefined);
      });
  }
  
  load_tarifs (search) {
    this.subscription = this.tarifsService.getTarifs(search)
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
        ),
      )
      .subscribe((data) => {
        this.tarifs = data.data;
        this.isLoaded = true;
      });
  }
  
  ngOnDestroy () {
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (this.subscription2) { this.subscription2.unsubscribe(); }
  }
  
}
