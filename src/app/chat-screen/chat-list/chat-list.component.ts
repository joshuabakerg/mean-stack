import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WebsocketService} from '../../services/websocket.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  chatItems = [];

  private websocketServiceConnection;

  @Output() selectedChat = new EventEmitter<any>();

  constructor(private httpClient: HttpClient,
              private websocketService: WebsocketService) {
  }

  ngOnInit() {
    this.websocketServiceConnection = this.websocketService.connect();
    this.websocketServiceConnection.subscribe(value => {
      if (value.type === 'new-chat') {
        this.chatItems.push(value.data);
        console.log(value.data);
      }
    });

    this.httpClient.get('/services/chat/').subscribe((res: any) => {
      this.chatItems = res.chat;
      if (this.chatItems && this.chatItems[0]) {
        this.selectedChat.emit(res.chat[0]);
      }
    });
  }

  ngOnDestroy(): void {
  }

  getChatDetails(chat) {
    const userDetail = chat.userDetails[chat.mainUser];
    return userDetail || {
      name: 'Empty chat',
      image: undefined,
      status: 'No users present'
    };
  }

  onChatClick(chat) {
    this.selectedChat.emit(chat);
  }

}
