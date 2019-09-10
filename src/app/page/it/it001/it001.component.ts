import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it001',
  templateUrl: './it001.component.html',
  styleUrls: ['./it001.component.css']
})
export class It001Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: "ขอใช้บริการเครือข่าย",
      link: "#",
    }
  ];
}
