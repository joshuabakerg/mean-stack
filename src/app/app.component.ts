import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthGuard} from './auth-guard.service';
import {Subscription} from 'rxjs';

declare const M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  pages = [
    {name: 'Chat', url: '/chat'},
    {name: 'Servers', url: '/server'},
    {name: 'Person', url: '/person'}
  ];

  user = undefined;
  private userSub: Subscription;

  constructor(private router: Router, private auth: AuthGuard) {
  }

  pageClick(page) {
    this.router.navigate([page.url]);
  }

  logout() {
    this.auth.logout().subscribe(loggedOut => {
      if (loggedOut) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    let elems = document.querySelectorAll('.dropdown-trigger');
    console.log(elems);
    M.Dropdown.init(elems, {coverTrigger: false});
    elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
    this.userSub = this.auth.getUserChanges().subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
