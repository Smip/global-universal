import { Directive, ElementRef, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const M: any;

@Directive({
  selector: '[globalDropdown]'
})
export class DropdownDirective implements OnInit {
  @Input('globalDropdown') globalDropdown: object;
  options: object;
  
  constructor (private element: ElementRef,
               @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit () {
    if (isPlatformBrowser(this.platformId)) {
      this.options = {
        'constrainWidth': false
      };
      
      setTimeout(() => {
        Object.assign(this.options, this.globalDropdown);
        M.Dropdown.init(this.element.nativeElement, this.options);
      }, 0);
    }
  }
}
