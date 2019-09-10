import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-garbagedis001',
  templateUrl: './garbagedis001.component.html',
  styleUrls: ['./garbagedis001.component.css']
})
export class Garbagedis001Component implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดกำจัดขยะ",
      link: "/home/firebrigade",
    },
    {
      label: "บันทึกข้อมูลบริการกำจัดขยะ",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
