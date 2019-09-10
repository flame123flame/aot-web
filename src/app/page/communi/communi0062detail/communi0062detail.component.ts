import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-communi0062detail',
  templateUrl: './communi0062detail.component.html',
  styleUrls: ['./communi0062detail.component.css']
})
export class Communi0062detailComponent implements OnInit {

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
      label: "ปรับปรุงอัตราค่าภาระการเปลี่ยนสัญลักษณ์ (Logo), Static Image และ  Code สายการบิน",
      link: "#",
    },
   
  ];
}
