import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it009',
  templateUrl: './it009.component.html',
  styleUrls: ['./it009.component.css']
})
export class It009Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: "ขอใช้บริการ Staff page และ Public page",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
