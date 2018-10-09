import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {
  }

  getAllMessages(): Observable<any> {
    return this.http.get('/services/chat');
  }

  getMessages(messageId): Observable<any> {
    return this.http.get('/services/chat/messages/' + messageId);
  }

  addNewConversation(users): Observable<any> {
    console.log('here');
    return this.http.post('/services/chat/conversation', {users, includeRequester: true});
  }

}
