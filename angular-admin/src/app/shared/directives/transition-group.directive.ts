import { Directive, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[transitionGroup]'
})
export class TransitionGroupDirective implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef) {
    this.el.nativeElement.classList.add('transition-group-start')
  }

  ngAfterViewInit () {
    this.el.nativeElement.classList.add('transition-group-start')

    setTimeout(() => {
      this.el.nativeElement.classList.remove('transition-group-start')
      this.el.nativeElement.classList.add('transition-group-done')
    }, 100)
  }

  ngOnDestroy () {
    this.el.nativeElement.classList.remove('transition-group-done')
    this.el.nativeElement.classList.add('transition-group-start')
  }
}
