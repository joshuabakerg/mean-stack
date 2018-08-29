import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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
    this.http.get('http://localhost:3000/services/script').subscribe(data => {
      this.scripts = <any[]>data;
    });

  }

  onScriptClick(scriptname: string) {
    this.currentScript =  this.scripts.find((script) => script.name === scriptname);
  }

  stringify(obj) {
    return JSON.stringify(obj, undefined, 2);
  }

}
