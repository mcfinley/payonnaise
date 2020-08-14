import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusManagerRoutingModule } from './status-manager-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule,
    StatusManagerRoutingModule,
    SharedModule,
  ]
})
export class StatusManagerModule { }
