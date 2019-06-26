import { Directive, ElementRef, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const M: any;

@Directive({
  selector: '[globalModal]'
})
export class ModalDirective implements OnInit {
  @Input('globalModal') globalModal: object;
  options: object;
  
  constructor (private element: ElementRef,
               @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }
  
  ngOnInit () {
    if (isPlatformBrowser(this.platformId)) {
      this.options = {};
      
      setTimeout(() => {
        Object.assign(this.options, this.globalModal);
        M.Modal.init(this.element.nativeElement, this.options);
      }, 0);
    }
  }
  
}
