import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it0104detail',
  templateUrl: './it0104detail.component.html',
  styleUrls: ['./it0104detail.component.css']
})
export class It0104detailComponent implements OnInit {

  constructor() { }
  breadcrumb: any = [
    {
      label: "หมวด IT",
      link: "/home/it",
    },
    {
      label: "กำหนดอัตราค่าภาระ การใช้บริการ Staff Page และ Public Page",
      link: "#",
    }
  ];
  ngOnInit() {
  }

}
