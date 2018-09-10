import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import * as io from 'socket.io-client';
import {CookieService} from 'ngx-cookie-service';
import {cookieCompare} from 'tough-cookie';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor(private cookieService: CookieService) {
  }

  connect(): Subject<MessageEvent> {
    const hostname = window.location.hostname;
    const connectionUrl = `http://${hostname}:${environment.socketPort}`;
    console.log(connectionUrl);
    this.socket = io.connect(connectionUrl);
    const observable = new Observable(obs => {
      this.socket.on('message', (data) => {
        console.log('Received a message from websocket server');
        obs.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    const observer = {
      next: (data: any) => {
        const sessionId = this.cookieService.get('sessionid');
        data.sessionId = sessionId;
        this.socket.emit('message', JSON.stringify(data));
      }
    };
    return Subject.create(observer, observable);
  }
}
