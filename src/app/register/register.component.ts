import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

declare const M: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  captures = [
    {display: 'User name', name: 'username', type: 'text', placeHolder: 'Enter email', value: ''},
    {display: 'Password', name: 'password', type: 'password', placeHolder: 'Enter password', value: ''},
    {display: 'Email', name: 'email', type: 'email', placeHolder: 'Enter your email', value: ''},
    {display: 'Name', name: 'name', type: 'text', placeHolder: 'Enter your first name', value: ''},
  ];

  message: String;
  error: String;

  constructor(private router: Router, private http: HttpClient) {
  }

  ngOnInit() {

  }

  onFormChange($event) {
  }

  showPassword() {
    M.toast({html: this.getValue('password')});
  }

  submit() {
    const user = {
      login: {
        username: this.getValue('username'),
        password: this.getValue('password')
      },
      email: this.getValue('email'),
      name: {
        first: this.getValue('name')
      }
    };
    console.log('Registering user', user);
    this.http.post('/services/user/register', user).subscribe((res: any) => {
      if (res.created) {
        M.toast({html: `Successfully created user ${user.login.username}`});
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.error = res.message;
      }
    });
  }

  getValue(name) {
    return this.captures.find(value => value.name === name).value;
  }

}
