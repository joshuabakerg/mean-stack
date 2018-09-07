import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public username: String;
  public password: String;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {
  }

  submit() {
    console.log({'username': this.username, 'password': this.password});
    this.http.post('/services/user/login', {'username': this.username, 'password': this.password}).subscribe((data: any) => {
      if (data.success) {
        setTimeout(() => {
          this.authService.user = data.user;
          this.router.navigate(['/person']);
        }, 200);
      }
    });
  }


}
