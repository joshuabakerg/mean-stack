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
      this.messages = this.getParsedMessages(value);
      this.scrollToBottomOfMessages();
    });

    this.messageEventSubject = this.websocketService.connect();
    this.websocketSubscription = this.messageEventSubject.subscribe(value => {
      if (value.type === 'new-message') {
        this.messages.push(value.data);
        this.messages = this.getParsedMessages(this.messages);
      }
      this.scrollToBottomOfMessages();
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

  scrollToBottomOfMessages() {
    setTimeout(() => {
      const objDiv = document.getElementById('message_div');
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 200);
  }

  fromMe(message): boolean {
    const from = message.from;
    return from === this.authGuard.user.login.username;
  }

  getMessagePosition(message): String {
    return this.fromMe(message) ? 'right' : 'left';
  }

  getParsedMessages(messages) {
    const parsedMessages = [];
    for (const message of messages) {
      const lastMessage = parsedMessages[parsedMessages.length - 1];
      if (lastMessage && lastMessage.from === message.from) {
        parsedMessages.push(Object.assign({isConsecutive: true}, message));
      } else {
        parsedMessages.push(Object.assign({isConsecutive: false}, message));
      }
    }
    return parsedMessages;
  }

  getMessageColor(message) {
    if (this.fromMe(message)) {
      return this.authGuard.user.gender === 'male' ? 'blue' : 'pink';
    }
    return '';
  }

}
