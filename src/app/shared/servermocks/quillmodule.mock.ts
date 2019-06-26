import { AfterViewInit, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

export interface CustomOption {
  import: string;
  whitelist: Array<any>;
}

@Component({
  selector: 'quill-editor',
  template: ``
})
export class QuillEditorComponent implements AfterViewInit {
  @Input() theme: string;
  @Input() modules: { [index: string]: Object };
  @Input() readOnly: boolean;
  @Input() placeholder: string;
  @Input() maxLength: number;
  @Input() minLength: number;
  @Input() required: boolean;
  @Input() formats: string[];
  @Input() style: any = {};
  @Input() strict = true;
  @Input() scrollingContainer: HTMLElement | string;
  @Input() bounds: HTMLElement | string;
  @Input() customOptions: CustomOption[] = [];
  
  @Output() onEditorCreated: EventEmitter<any> = new EventEmitter();
  @Output() onContentChanged: EventEmitter<any> = new EventEmitter();
  @Output() onSelectionChanged: EventEmitter<any> = new EventEmitter();
  
  ngAfterViewInit () {
  }
}

@NgModule({
  declarations: [
    QuillEditorComponent
  ],
  exports: [
    QuillEditorComponent
  ]
})

export class QuillModule {
}
