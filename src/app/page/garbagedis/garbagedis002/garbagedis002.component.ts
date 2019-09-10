import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-garbagedis002',
  templateUrl: './garbagedis002.component.html',
  styleUrls: ['./garbagedis002.component.css']
})
export class Garbagedis002Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดกำจัดขยะ",
      link: "/home/firebrigade",
    },
    {
      label: "ขอใช้บริการกำจัดขยะ",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
