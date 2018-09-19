import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {

  users = [];
  allUsers = [];

  userFilter = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('/services/user/all').subscribe((value: any) => {
      this.users = value;
      this.allUsers = value;
    });
  }

  deleteUser(user) {
    this.http.delete(`/services/user/${user.login.username}`).subscribe((res: any) => {
      if (res.success) {
        this.allUsers = this.allUsers.filter(checkuser => checkuser.login.username !== user.login.username);
        this.users = this.allUsers;
      }
    });
  }

  onSearchChanged(search) {
    if (search === '') {
      this.users = this.allUsers;
    } else {
      this.users = this.allUsers.filter(user => this.searchMatchesUser(user, search));
    }
  }

  searchMatchesUser(user, value): boolean {
    return JSON.stringify(user).includes(value);
  }

}
