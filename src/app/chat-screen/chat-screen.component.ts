import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '../services/websocket.service';
import {ChatService} from '../services/chat.service';
import {AuthGuard} from '../auth-guard.service';

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

  constructor(private chatService: ChatService, private websocketService: WebsocketService, private authGuard: AuthGuard) {
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

  fromMe(message): boolean {
    const from = message.from;
    return from === this.authGuard.user.login.username;
  }

  getMessagePosition(message): String {
    return this.fromMe(message) ? 'right' : 'left';
  }

  canShowProfilePic(currentMessage): boolean {
    if (currentMessage === this.messages[0]) {
      return true;
    }
    let lastMessage = this.messages[0];
    for (const message of this.messages) {
      if (message === currentMessage) {
        break;
      }
      lastMessage = message;
    }
    return !this.fromMe(lastMessage);
  }

}
