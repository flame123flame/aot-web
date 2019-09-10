import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it009detail',
  templateUrl: './it009detail.component.html',
  styleUrls: ['./it009detail.component.css']
})
export class It009detailComponent implements OnInit {

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
