import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi0061',
  templateUrl: './communi0061.component.html',
  styleUrls: ['./communi0061.component.css']
})
export class Communi0061Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  breadcrumb: any = [
    {
      label: "หมวดสื่อสาร",
      link: "/home/communi",
    },
    {
      label: "ปรับปรุงอัตราค่าภาระการใช้บริการสื่อสาร",
      link: "#",
    },
   
  ];
}
