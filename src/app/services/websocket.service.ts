import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import * as io from 'socket.io-client';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;
  private existingConnection;
  private hasSentRegister;

  constructor(private cookieService: CookieService) {
  }

  connect(): Subject<MessageEvent> {
    if (!this.existingConnection) {
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
    return this.existingConnection;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
