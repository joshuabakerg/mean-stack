import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthGuard} from '../auth-guard.service';
import {Subscription} from 'rxjs';

declare const M: any;

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit, OnDestroy {

  user = undefined;
  private userSub: Subscription;

  constructor(private http: HttpClient, private authGaurd: AuthGuard) {
  }

  ngOnInit() {
    this.userSub = this.authGaurd.getUserChanges().subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  onUpload(event) {
    const files = (<any>event.srcElement).files;
    const data = new FormData();
    data.append('pic', files[0], files[0].name);
    this.http.post('/services/upload/profilepic', data).subscribe((value: any) => {
      setTimeout(() => {
        this.authGaurd.updateUser();
      }, 500);
      M.toast({html: `Saved file tmp directory ${value.message}`});
    });
  }

  stringify(obj) {
    return JSON.stringify(obj, undefined, 2);
  }

}
