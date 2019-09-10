import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi003detail',
  templateUrl: './communi003detail.component.html',
  styleUrls: ['./communi003detail.component.css']
})
export class Communi003detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดสื่อสาร",
      link: "/home/communi",
    },
    {
      label: "เพิ่มขอเปลี่ยนสัญลักษณ์ (Logo), Static Image และ Code สายการบิน",
      link: "#",
    },
   
  ];
  ngOnInit() {
  }

}
