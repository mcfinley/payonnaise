import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransitionGroupDirective } from './directives/transition-group.directive';

@NgModule({
  declarations: [TransitionGroupDirective],
  imports: [
    CommonModule
  ],
  exports: [
    TransitionGroupDirective
  ],
})
export class SharedModule { }
