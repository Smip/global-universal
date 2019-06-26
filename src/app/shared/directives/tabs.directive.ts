import { Directive, ElementRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const M: any;

@Directive({
  selector: '[globalTabs]'
})
export class TabsDirective implements OnInit {
  
  constructor (private element: ElementRef,
               @Inject(PLATFORM_ID) private platformId: Object) {
  }
  
  ngOnInit () {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        M.Tabs.init(this.element.nativeElement);
      }, 0);
    }
  }
  
}
