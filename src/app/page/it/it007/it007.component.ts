import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it007',
  templateUrl: './it007.component.html',
  styleUrls: ['./it007.component.css']
})
export class It007Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: "รายงานการใช้ห้องฝึกอบรม CUTE",
      link: "#",
    }
  ];
  ngOnInit() {
  }
  
}
