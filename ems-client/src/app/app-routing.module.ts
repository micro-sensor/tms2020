import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/',
      pathMatch: 'full' },
    { path: '', loadChildren: () => import('./private/private.module').then(m => m.PrivateModule), canActivate: [AuthGuard],  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
