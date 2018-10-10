import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WebsocketService} from '../../services/websocket.service';

@Component({
  selector: 'app-mobile-chat-list',
  templateUrl: './mobile-chat-list.component.html',
  styleUrls: ['./mobile-chat-list.component.css']
})
export class MobileChatListComponent implements OnInit, OnDestroy {

  showChats = false;

  chatItems = [];

  private websocketServiceConnection;

  @Output() selectedChat = new EventEmitter<any>();
  @Output() requestedNewChat = new EventEmitter<any>();

  constructor(private httpClient: HttpClient,
              private websocketService: WebsocketService) {
  }

  ngOnInit() {
    this.websocketServiceConnection = this.websocketService.getConnection();
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
    this.websocketServiceConnection.unsubscribe();
  }

  getChatDetails(chat) {
    const userDetail = chat.userDetails[chat.mainUser];
    return userDetail || {
      name: 'Empty chat',
      image: undefined,
      status: 'No users present'
    };
  }

  onNewChatClick() {
    console.log('btn clicked');
    this.requestedNewChat.emit({});
  }

  onChatClick(chat) {
    this.onShowChatsClick();
    this.selectedChat.emit(chat);
  }

  onShowChatsClick() {
    this.showChats = !this.showChats;
  }

}
