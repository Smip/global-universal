import { Directive, ElementRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const M: any;

@Directive({
  selector: '[globalSidenav]'
})
export class SidenavDirective implements OnInit {
  
  constructor (private element: ElementRef,
               @Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit () {
    if (isPlatformBrowser(this.platformId)) {
      M.Sidenav.init(this.element.nativeElement);
    }
  }
  
}
