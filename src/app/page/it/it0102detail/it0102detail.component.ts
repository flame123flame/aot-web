import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it0102detail',
  templateUrl: './it0102detail.component.html',
  styleUrls: ['./it0102detail.component.css']
})
export class It0102detailComponent implements OnInit {

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
