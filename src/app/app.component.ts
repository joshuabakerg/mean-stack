import {Component} from '@angular/core';
import {Router} from '@angular/router';

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

  title = 'app';

  constructor(private router: Router) {
  }

  pageClick(page) {
    this.router.navigate([page.url]);
  }

}
