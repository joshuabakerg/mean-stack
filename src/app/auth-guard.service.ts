import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
  }

  fetchedUser = false;

  user: any;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.fetchedUser) {
      return this.user !== null;
    }
    return this.http.get('/services/user').pipe(map(user => {
      this.user = user;
      this.fetchedUser = true;
      if (user != null) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }));
  }
}
