import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  private data: Observable<any>;
  private userChange: Observer<any>;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
    this.data = new Observable(obs => this.userChange = obs);
    http.get('/services/user').subscribe(user => {
      this.setUser(user);
    });
  }

  fetchedUser = false;

  user: any;

  setUser(user) {
    this.user = user;
    this.userChange.next(user);
  }

  getUser(): Observable<any> {
    return this.data;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.fetchedUser) {
      return this.user !== null;
    }
    return this.http.get('/services/user').pipe(map(user => {
      this.setUser(user);
      this.fetchedUser = true;
      if (user != null) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }));
  }
}
