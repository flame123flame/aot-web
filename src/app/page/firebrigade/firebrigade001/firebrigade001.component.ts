import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firebrigade001',
  templateUrl: './firebrigade001.component.html',
  styleUrls: ['./firebrigade001.component.css']
})
export class Firebrigade001Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดดับเพลิง",
      link: "/home/firebrigade",
    },
    {
      label: "บริหารจัดการรายได้ค่าจัดฝึกอบรมการดับเพลิงและกู้ภัย",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
