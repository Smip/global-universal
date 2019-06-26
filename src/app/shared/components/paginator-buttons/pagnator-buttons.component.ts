import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'global-parinator-buttons',
  templateUrl: './paginator-buttons.component.html',
  styleUrls: ['./paginator-buttons.component.scss']
})
export class PaginatorButtonsComponent {
  @Input() page: number;
  @Input() count: number;
  @Input() perPage: number;
  @Input() pagesToShow: number;
  @Input() link: string;
  
  @Output() goPrev = new EventEmitter<boolean>();
  @Output() goNext = new EventEmitter<boolean>();
  @Output() goPage = new EventEmitter<number>();
  
  constructor () {
  }
  
  onPage (n: number): void {
    this.goPage.emit(n);
  }
  
  onPrev (): void {
    this.goPrev.emit(true);
  }
  
  onNext (next: boolean): void {
    this.goNext.emit(next);
  }
  
  lastPage (): boolean {
    return this.perPage * this.page > this.count;
  }
  
  getPages (): number[] {
    const c = Math.ceil(this.count / this.perPage);
    const p = this.page || 1;
    const pagesToShow = this.pagesToShow || 9;
    const pages: number[] = [];
    pages.push(p);
    const times = pagesToShow - 1;
    for (let i = 0; i < times; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min.apply(null, pages) > 1) {
          pages.push(Math.min.apply(null, pages) - 1);
        }
      }
      if (pages.length < pagesToShow) {
        if (Math.max.apply(null, pages) < c) {
          pages.push(Math.max.apply(null, pages) + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }
}
