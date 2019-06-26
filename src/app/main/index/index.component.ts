import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'global-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  
  constructor (private title: Title) {
    title.setTitle('Интернет-телефония с фиксированным номером - Global.ua');
  }
  
  ngOnInit () {
  
  }
  
}
