import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import * as io from 'socket.io-client';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

  private socket;
  private existingConnection;

  constructor(private cookieService: CookieService) {
    console.log('Creating websocket service');
    const connectionUrl = window.location.origin;
    console.log(connectionUrl);
    this.socket = io.connect(connectionUrl);
    const observable = new Observable(obs => {
      this.socket.on('message', (data) => {
        console.log('Received a message from websocket server');
        obs.next(data);
      });
      return () => {
        // this.socket.disconnect();
      };
    });
    const observer = {
      next: (data: any) => {
        const sessionId = this.cookieService.get('sessionid');
        data.sessionId = sessionId;
        this.socket.emit('message', JSON.stringify(data));
      }
    };
    this.existingConnection = Subject.create(observer, observable);
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  getConnection(): Subject<MessageEvent> {
    return this.existingConnection;
  }
}
