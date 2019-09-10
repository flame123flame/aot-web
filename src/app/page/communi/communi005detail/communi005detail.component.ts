import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi005detail',
  templateUrl: './communi005detail.component.html',
  styleUrls: ['./communi005detail.component.css']
})
export class Communi005detailComponent implements OnInit {

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
