import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {AppComponent} from './app.component';
import {ServerComponent} from './server/server.component';
import {RouterModule, Routes} from '@angular/router';
import {PersonComponent} from './person/person.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import {LoginRoutingModule} from './login-routing.module';
import {AppRoutingModule} from './app-routing.module';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    ServerComponent,
    PersonComponent,
    PageNotFoundComponent,
    LoginComponent,
    ChatScreenComponent,
    UserManagerComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    LoginRoutingModule,
    AppRoutingModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
