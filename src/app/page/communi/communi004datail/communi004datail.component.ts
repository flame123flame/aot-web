import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi004datail',
  templateUrl: './communi004datail.component.html',
  styleUrls: ['./communi004datail.component.css']
})
export class Communi004datailComponent implements OnInit {

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
