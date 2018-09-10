import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '../services/websocket.service';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit, OnDestroy {

  private messageEventSubject;
  private websocketSubscription;

  constructor(private websocketService: WebsocketService) {
  }

  ngOnInit() {
    this.messageEventSubject = this.websocketService.connect();
    this.websocketSubscription = this.messageEventSubject.subscribe(value => {
      console.log(value);
    });
  }

  ngOnDestroy(): void {
    this.websocketSubscription.unsubscribe();
  }

  onClick() {
    this.messageEventSubject.next({type: 'new-message', message: 'Hello'});
  }

}
