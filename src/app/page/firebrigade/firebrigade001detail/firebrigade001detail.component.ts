import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firebrigade001detail',
  templateUrl: './firebrigade001detail.component.html',
  styleUrls: ['./firebrigade001detail.component.css']
})
export class Firebrigade001detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดดับเพลิง",
      link: "/home/firebrigade",
    },
    {
      label: "บริหารจัดการรายได้ค่าจัดฝึกอบรมการดับเพลิงและกู้ภัย",
      link: "#",
    },
    {
      label: "เพิ่มข้อมูลบริหารจัดการรายได้ค่าจัดฝึกอบรมการดับเพลิงและกู้ภัย",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
