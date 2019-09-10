import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi0062',
  templateUrl: './communi0062.component.html',
  styleUrls: ['./communi0062.component.css']
})
export class Communi0062Component implements OnInit {

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
