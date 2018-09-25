import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

declare const M: any;

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  scripts: any[];
  currentScript;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('/services/script').subscribe(data => {
      this.scripts = <any[]>data;
    });

  }

  onUpload(event) {
    const files = (<any>event.srcElement).files;
    const data = new FormData();
    data.append('pic', files[0], files[0].name);
    this.http.post('/services/upload/profilepic', data).subscribe((value: any) => {
      console.log(value);
      M.toast({html: `Saved file tmp directory ${value.message}`});
    });
  }

  onScriptClick(scriptname: string) {
    this.currentScript = this.scripts.find((script) => script.name === scriptname);
  }

  stringify(obj) {
    return JSON.stringify(obj, undefined, 2);
  }

}
