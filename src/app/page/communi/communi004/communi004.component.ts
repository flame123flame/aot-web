import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi004',
  templateUrl: './communi004.component.html',
  styleUrls: ['./communi004.component.css']
})
export class Communi004Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดสื่อสาร",
      link: "/home/communi",
    },
    {
      label: "ขอใช้บริการสัญญาณภาพแสดงผลข้อมูลตารางการบิน",
      link: "#",
    },
   
  ];
  ngOnInit() {
  }

}
