import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from '../services/websocket.service';
import {ChatService} from '../services/chat.service';
import {AuthGuard} from '../auth-guard.service';
import {UserService} from '../services/user.service';

declare const M: any;

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit, OnDestroy {

  newMessageText: String;
  selectedChat;

  messages = [];
  users = [];

  private messageEventSubject;
  private websocketSubscription;

  private modals = [];

  constructor(private chatService: ChatService,
              private userService: UserService,
              private websocketService: WebsocketService,
              private authGuard: AuthGuard) {
  }

  ngOnInit() {
    this.chatService.getAllMessages().subscribe(value => {
      this.messages = this.getParsedMessages(value);
      this.scrollToBottomOfMessages();
    });

    this.messageEventSubject = this.websocketService.getConnection();
    this.websocketSubscription = this.messageEventSubject.subscribe(value => {
      if (value.type === 'new-message') {
        this.messages.push(value.data);
        this.messages = this.getParsedMessages(this.messages);
      }
      this.scrollToBottomOfMessages();
    });

    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems);
    this.modals = instances;
  }

  ngOnDestroy(): void {
    if (this.selectedChat) {
      this.messageEventSubject.next({
        type: 'exit-chat',
        convId: this.selectedChat.id
      });
    }
    this.websocketSubscription.unsubscribe();
  }

  onAddChatClick() {
    this.modals.forEach(modal => {
      modal.open();
    });
    this.userService.getAllUserNames().subscribe(res => {
      this.users = res;
    });
  }

  onNewChatClick(user) {
    this.modals.forEach(modal => {
      modal.close();
    });
    this.chatService.addNewConversation([user]).subscribe(res => {
      console.log(res);
    });
  }

  onClick() {
    console.log(this.newMessageText);
    if (this.newMessageText && this.newMessageText !== '') {
      this.messageEventSubject.next({
        type: 'create-new-message',
        convId: this.selectedChat.id,
        message: this.newMessageText
      });
      this.newMessageText = '';
    }
  }

  scrollToBottomOfMessages() {
    setTimeout(() => {
      const objDiv = document.getElementById('message_div');
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
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

  getChatDetails(chat) {
    const userDetail = chat.userDetails[chat.mainUser];
    return userDetail || {
      name: 'Empty chat',
      image: undefined,
      status: 'No users present'
    };
  }

  onChatChanged(chat) {
    if (this.selectedChat) {
      this.messageEventSubject.next({
        type: 'exit-chat',
        convId: this.selectedChat.id
      });
    }
    if (chat) {
      this.messageEventSubject.next({
        type: 'join-chat',
        convId: chat.id
      });
    }
    this.selectedChat = chat;
    this.messages = [];
    this.chatService.getMessages(chat.messages).subscribe(value => {
      this.messages = value.messages;
      this.scrollToBottomOfMessages();
    });
  }

}
