import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {ServerComponent} from './server/server.component';
import {RouterModule, Routes} from '@angular/router';
import {PersonComponent} from './person/person.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {path: 'server', component: ServerComponent, data: {title: 'Book List'}},
  {path: 'person', component: PersonComponent, data: {title: 'Peron view'}},
  {path: '', redirectTo: '/server', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent, data: {title: 'Page Not Found'}}
];

@NgModule({
  declarations: [
    AppComponent,
    ServerComponent,
    PersonComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
