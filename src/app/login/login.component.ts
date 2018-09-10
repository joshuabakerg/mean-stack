import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthGuard} from '../auth-guard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public username: String;
  public password: String;

  public error: String;

  constructor(private router: Router, private http: HttpClient, private authService: AuthGuard) {
  }

  submit() {
    this.error = undefined;
    console.log({'username': this.username, 'password': this.password});
    this.http.post('/services/user/login', {'username': this.username, 'password': this.password}).subscribe((data: any) => {
      if (data.success) {
        this.authService.setUser(data.user);
        this.router.navigate(['/person']);
      } else {
        this.error = data.message;
      }
    });
  }


}
