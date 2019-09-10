import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firebrigade002detail',
  templateUrl: './firebrigade002detail.component.html',
  styleUrls: ['./firebrigade002detail.component.css']
})
export class Firebrigade002detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดดับเพลิง",
      link: "/home/firebrigade",
    },
    {
      label: "ปรับปรุงอัตราค่าภาระจัดฝึกอบรมการดับเพลิงและกู้ภัย",
      link: "#",
    },
    {
      label: "กำหนดอัตราค่าภาระจัดฝึกอบรมการดับเพลิงและกู้ภัย",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
