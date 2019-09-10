import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi003',
  templateUrl: './communi003.component.html',
  styleUrls: ['./communi003.component.css']
})
export class Communi003Component implements OnInit {

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
