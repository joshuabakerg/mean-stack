import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  private readonly userChange: Subject<any>;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
    this.userChange = new Subject();
    this.getUserOrigin().subscribe(user => this.setUser(user));
  }

  fetchedUser = false;

  user: any;

  setUser(user) {
    this.user = user;
    this.userChange.next(user);
  }

  getUserOrigin(): Observable<any> {
    return this.http.get('/services/user');
  }

  getUser(): any {
    return this.user;
  }

  getUserChanges(): Subject<any> {
    return this.userChange;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.fetchedUser) {
      return this.user !== null;
    }
    return this.getUserOrigin().pipe(map(user => {
      this.setUser(user);
      this.fetchedUser = true;
      if (user != null) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }));
  }

  logout() {
    return this.http.get('/services/user/logout').pipe(map((value: any) => {
      if (value.success) {
        this.setUser(null);
      } else {
        console.log(value.message);
      }
      return value.success;
    }));
  }
}
