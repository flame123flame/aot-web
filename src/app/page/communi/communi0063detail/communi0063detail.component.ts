import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi0063detail',
  templateUrl: './communi0063detail.component.html',
  styleUrls: ['./communi0063detail.component.css']
})
export class Communi0063detailComponent implements OnInit {

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
      label: "กำหนดอัตราค่าภาระ การใช้บริการสัญญาณภาพแสดงผลข้อมูลตารางการบิน",
      link: "#",
    },
   
  ];
}
