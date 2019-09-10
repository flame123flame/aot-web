import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-garbagedis0302detail',
  templateUrl: './garbagedis0302detail.component.html',
  styleUrls: ['./garbagedis0302detail.component.css']
})
export class Garbagedis0302detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวดกำจัดขยะ",
      link: "/",
    },
    {
      label: "กำหนดอัตราค่าภาระดับเพลิง",
      link: "#",
    },
   
  ];
  ngOnInit() {
  }

}
