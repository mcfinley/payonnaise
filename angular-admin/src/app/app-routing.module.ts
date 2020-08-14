import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const delay = (time) => (data) => new Promise<any>((resolve) => setTimeout(() => resolve(data), time))

const routes: Routes = [
  { path: '', loadChildren: () => import('./status-manager/status-manager.module').then(delay(1000)).then(m => m.StatusManagerModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
