import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-garbagedis002detail',
  templateUrl: './garbagedis002detail.component.html',
  styleUrls: ['./garbagedis002detail.component.css']
})
export class Garbagedis002detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดกำจัดขยะ",
      link: "/home/firebrigade",
    },
    {
      label: "ขอใช้บริการกำจัดขยะ",
      link: "#",
    },
    {
      label: "เพิ่มขอใช้บริการกำจัดขยะ",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
