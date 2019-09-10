import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generalinfo002',
  templateUrl: './generalinfo002.component.html',
  styleUrls: ['./generalinfo002.component.css']
})
export class Generalinfo002Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "ข้อมูลทั่วไป",
      link: "/home/geninfo",
    },
    {
      label: "ผลลัพธ์ของการค้นหาผู้ประกอบการ",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
