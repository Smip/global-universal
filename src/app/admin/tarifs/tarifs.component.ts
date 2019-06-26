import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, iif, of, throwError } from 'rxjs';
import { Tarif } from '../../shared/models/tarif.model';
import { TarifsService } from '../../shared/services/tarifs.service';
import { concatMap, debounceTime, delay, distinct, pluck, retryWhen } from 'rxjs/internal/operators';
import { Subscription } from 'rxjs/Subscription';

declare const M: any;

@Component({
  selector: 'global-tarifs',
  templateUrl: './tarifs.component.html',
  styleUrls: ['./tarifs.component.scss']
})
export class TarifsComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  tarifs: Tarif[];
  isLoaded = false;
  fileUploading = false;
  
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
  
  handleFileInput (event) {
    this.fileUploading = true;
    const input = new FormData();
    input.append('file', event[0]);
    this.subscription3 = this.tarifsService.postTarifs(input).subscribe((data) => {
      this.load_tarifs(undefined);
      this.fileUploading = false;
      M.toast({html: 'Файл загружен. Загружено ' + data.total + ' направлений'});
    }, (error) => {
      alert('Ошибка. Неверный файл. Ошибка номер:' + error.status + ' Ответ от сервера:' + error.error.message);
      this.fileUploading = false;
    });
  }
  
  load_tarifs (search) {
    this.isLoaded = false;
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
    if (this.subscription3) { this.subscription3.unsubscribe(); }
  }
  
}
