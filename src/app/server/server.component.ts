import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {

  servers: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('/services/server').subscribe(data => {
      this.servers = data;
    });
  }

}
