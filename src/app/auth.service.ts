import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';

@Injectable()
export class AuthService {

  public user = undefined;

  constructor(private router: Router, private http: HttpClient) {
    console.log('Trying to get current login');
    http.get('/services/user').subscribe((data: any) => {
      this.user = data;
    });
  }

  getAuthenticated(): Observable<any> {
    return this.http.get('/services/user');
  }


  login(): void {
    this.http.get('/services/user').subscribe((data: any) => {
      this.user = data;
    });
  }

  logout(): void {
    this.http.get('/services/logout').subscribe((data: any) => {
      this.user = null;
    });
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
