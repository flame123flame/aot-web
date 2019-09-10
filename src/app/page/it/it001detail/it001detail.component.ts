import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it001detail',
  templateUrl: './it001detail.component.html',
  styleUrls: ['./it001detail.component.css']
})
export class It001detailComponent implements OnInit {

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
