import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusManagerRoutingModule } from './status-manager-routing.module';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule,
    StatusManagerRoutingModule
  ]
})
export class StatusManagerModule { }
