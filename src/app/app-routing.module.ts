import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path     : '',
    component: MessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path     : 'about',
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path     : 'login',
    component: LoginComponent
  },
  {
    path      : '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
