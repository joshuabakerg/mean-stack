import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthGuard} from './auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  pages = [
    {name: 'Servers', url: '/server'},
    {name: 'Person', url: '/person'}
  ];

  user = undefined;

  constructor(private router: Router, private http: HttpClient, auth: AuthGuard) {
    auth.getUser().subscribe(user => this.user = user);
  }

  pageClick(page) {
    this.router.navigate([page.url]);
  }

}
