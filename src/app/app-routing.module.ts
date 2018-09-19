import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ServerComponent} from './server/server.component';
import {PersonComponent} from './person/person.component';
import {LoginComponent} from './login/login.component';
import {CanDeactivateGuard} from './can-deactivate-guard.service';
import {SelectivePreloadingStrategy} from './selective-preloading-strategy';
import {AuthGuard} from './auth-guard.service';
import {ChatScreenComponent} from './chat-screen/chat-screen.component';
import {UserManagerComponent} from './user-manager/user-manager.component';

const appRoutess: Routes = [
  {path: 'server', component: ServerComponent, canActivate: [AuthGuard]},
  {path: 'person', component: PersonComponent, canActivate: [AuthGuard]},
  {path: 'chat', component: ChatScreenComponent, canActivate: [AuthGuard]},
  {path: 'user-manager', component: UserManagerComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/server', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent, data: {title: 'Page Not Found'}}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutess,
      {
        // enableTracing: true, // <-- debugging purposes only
        preloadingStrategy: SelectivePreloadingStrategy,

      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanDeactivateGuard,
    SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule {
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
