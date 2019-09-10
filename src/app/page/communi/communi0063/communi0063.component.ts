import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi0063',
  templateUrl: './communi0063.component.html',
  styleUrls: ['./communi0063.component.css']
})
export class Communi0063Component implements OnInit {

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
