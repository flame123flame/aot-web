import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-garbagedis001detail',
  templateUrl: './garbagedis001detail.component.html',
  styleUrls: ['./garbagedis001detail.component.css']
})
export class Garbagedis001detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดกำจัดขยะ",
      link: "/home/firebrigade",
    },
    {
      label: "บันทึกข้อมูลบริการกำจัดขยะ",
      link: "#",
    },
    {
      label: "บันทึกข้อมูลบริการกำจัดขยะ",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
