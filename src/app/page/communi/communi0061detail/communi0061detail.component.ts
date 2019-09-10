import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi0061detail',
  templateUrl: './communi0061detail.component.html',
  styleUrls: ['./communi0061detail.component.css']
})
export class Communi0061detailComponent implements OnInit {

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
      link: "/home/communi",
    },
    {
      label: "กำหนดอัตราค่าภาระ การใช้วิทยุมือถือ",
      link: "#",
    },
   
  ];
}
