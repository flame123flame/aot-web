import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firebrigade002',
  templateUrl: './firebrigade002.component.html',
  styleUrls: ['./firebrigade002.component.css']
})
export class Firebrigade002Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดดับเพลิง",
      link: "/home/firebrigade",
    },
    {
      label: "ปรับปรุงอัตราค่าภาระจัดฝึกอบรมการดับเพลิงและกู้ภัย",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
