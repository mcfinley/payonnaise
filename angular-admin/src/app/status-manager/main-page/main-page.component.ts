import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit, AfterViewInit {
  viewInitialized = false

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.viewInitialized = true
    })

  }

  ngAfterViewInit () {
    // this.viewInitialized = true
  }
}
