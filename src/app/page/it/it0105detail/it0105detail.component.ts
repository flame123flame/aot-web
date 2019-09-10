import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-it0105detail',
  templateUrl: './it0105detail.component.html',
  styleUrls: ['./it0105detail.component.css']
})
export class It0105detailComponent implements OnInit {

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
