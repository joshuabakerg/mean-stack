import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '../services/websocket.service';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit, OnDestroy {

  newMessageText: String;

  messages = [];

  private messageEventSubject;
  private websocketSubscription;

  constructor(private chatService: ChatService, private websocketService: WebsocketService) {
  }

  ngOnInit() {
    this.chatService.getAllMessages().subscribe(value => {
      this.messages = value;
    });

    this.messageEventSubject = this.websocketService.connect();
    this.websocketSubscription = this.messageEventSubject.subscribe(value => {
      console.log(value.data);
      if (value.type === 'new-message') {
        this.messages.push(value.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.websocketSubscription.unsubscribe();
  }

  onClick() {
    console.log(this.newMessageText);
    if (this.newMessageText && this.newMessageText !== '') {
      this.messageEventSubject.next({type: 'create-new-message', message: this.newMessageText});
      this.newMessageText = '';
    }
  }

}
