import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi005',
  templateUrl: './communi005.component.html',
  styleUrls: ['./communi005.component.css']
})
export class Communi005Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดสื่อสาร",
      link: "/home/communi",
    },
    {
      label: "ขอยกเลิกการใช้บริการสัญญาณภาพแสดงผลข้อมูลตารางการบิน",
      link: "#",
    },
   
  ];
  ngOnInit() {
  }

}
